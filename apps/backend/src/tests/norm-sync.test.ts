import assert from "node:assert/strict";
import { buildApp } from "../app.js";
import {
  parseXmlFeed,
  checkHseRelevance,
  computeSha256,
} from "../modules/norm-sync/normSyncService.js";

async function run() {
  // 1. Test parsing XML e calcolo SHA-256
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Gazzetta Ufficiale</title>
      <item>
        <title><![CDATA[Decreto Ministeriale 12 gennaio 2026 - Sicurezza nei luoghi di lavoro e DPI]]></title>
        <link>https://www.gazzettaufficiale.it/atto/serie_generale/2026/01/12</link>
        <description><![CDATA[<p>Nuove disposizioni tecniche relative alla <b>valutazione del rischio</b> e utilizzo dei dispositivi di protezione individuale (DPI).</p>]]></description>
        <pubDate>Mon, 12 Jan 2026 08:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Regolamento Igiene e HACCP MOCA 2026</title>
        <link>https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32026R0099</link>
        <description>Criteri di conformita per materiali a contatto con alimenti e piani di autocontrollo HACCP.</description>
        <pubDate>Tue, 13 Jan 2026 10:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Concorso pubblico per impiegati amministrativi</title>
        <link>https://www.gazzettaufficiale.it/concorsi/1</link>
        <description>Bando per la selezione di personale amministrativo.</description>
      </item>
    </channel>
  </rss>`;

  const parsed = parseXmlFeed(sampleXml);
  assert.equal(parsed.length, 3);

  // Verifica primo item: sicurezza lavoro
  assert.ok(parsed[0].title.includes("Sicurezza nei luoghi di lavoro e DPI"));
  assert.ok(!parsed[0].description.includes("<p>"), "HTML tags should be stripped");
  assert.ok(parsed[0].isRelevant);
  assert.equal(parsed[0].domain, "safety");
  assert.ok(parsed[0].contentHash.length === 64, "SHA-256 hash must be 64 hex characters");

  // Verifica secondo item: HACCP
  assert.ok(parsed[1].isRelevant);
  assert.equal(parsed[1].domain, "haccp");

  // Verifica terzo item: non pertinente
  assert.equal(parsed[2].isRelevant, false);

  // 2. Test server Fastify
  const app = buildApp();
  await app.ready();
  await app.prisma.normativePatchProposal.deleteMany();
  await app.prisma.normativeSource.deleteMany();

  // Login come admin
  const adminLogin = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "admin@fedshield.local",
      password: "fedshield123",
    },
  });
  assert.equal(adminLogin.statusCode, 200);
  const { token: adminToken } = adminLogin.json();

  // Login come junior
  const juniorLogin = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: {
      email: "junior@fedshield.local",
      password: "fedshield123",
    },
  });
  assert.equal(juniorLogin.statusCode, 200);
  const { token: juniorToken } = juniorLogin.json();

  // Junior tenta di avviare la sincronizzazione -> 403 Forbidden
  const forbiddenRes = await app.inject({
    method: "POST",
    url: "/api/norm-sync/sync-now",
    headers: { authorization: `Bearer ${juniorToken}` },
    payload: { forceSimulate: true },
  });
  assert.equal(forbiddenRes.statusCode, 403);

  // Status iniziale
  const statusRes1 = await app.inject({
    method: "GET",
    url: "/api/norm-sync/status",
    headers: { authorization: `Bearer ${adminToken}` },
  });
  assert.equal(statusRes1.statusCode, 200);
  const status1 = statusRes1.json();
  assert.ok(status1.sources.length >= 2, "Default sources should be auto-provisioned");

  // Admin esegue sincronizzazione immediata (con simulate per isolamento test)
  const syncRes1 = await app.inject({
    method: "POST",
    url: "/api/norm-sync/sync-now",
    headers: { authorization: `Bearer ${adminToken}` },
    payload: { forceSimulate: true },
  });
  assert.equal(syncRes1.statusCode, 200);
  const syncData1 = syncRes1.json();
  assert.equal(syncData1.success, true);
  assert.ok(syncData1.sourcesChecked >= 2);
  assert.ok(syncData1.proposalsCreated >= 1, "Should have created proposals");

  const createdCount = syncData1.proposalsCreated;

  // Seconda sincronizzazione: deduplicazione tramite hash SHA-256
  const syncRes2 = await app.inject({
    method: "POST",
    url: "/api/norm-sync/sync-now",
    headers: { authorization: `Bearer ${adminToken}` },
    payload: { forceSimulate: true },
  });
  assert.equal(syncRes2.statusCode, 200);
  const syncData2 = syncRes2.json();
  assert.equal(syncData2.proposalsCreated, 0, "No duplicate proposals should be created on second sync");
  assert.ok(syncData2.skippedExisting >= createdCount, "Duplicates should be skipped");

  // Verifica elenco proposte
  const proposalsRes = await app.inject({
    method: "GET",
    url: "/api/norm-sync/proposals?status=pending",
    headers: { authorization: `Bearer ${adminToken}` },
  });
  assert.equal(proposalsRes.statusCode, 200);
  const proposals = proposalsRes.json();
  assert.ok(proposals.length >= createdCount);

  // Approva una proposta
  const proposalToApprove = proposals[0];
  const approveRes = await app.inject({
    method: "PATCH",
    url: `/api/norm-sync/proposals/${proposalToApprove.id}/approve`,
    headers: { authorization: `Bearer ${adminToken}` },
    payload: { status: "approved", note: "Approvato per inserimento nei controlli" },
  });
  assert.equal(approveRes.statusCode, 200);
  const approvedProposal = approveRes.json();
  assert.equal(approvedProposal.status, "approved");

  // Verifica status aggiornato
  const statusRes2 = await app.inject({
    method: "GET",
    url: "/api/norm-sync/status",
    headers: { authorization: `Bearer ${adminToken}` },
  });
  assert.equal(statusRes2.statusCode, 200);
  const status2 = statusRes2.json();
  assert.ok(status2.counts.approved >= 1);

  console.log("✓ Test NormSync completato con successo!");
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
