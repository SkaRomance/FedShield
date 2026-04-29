import { useEffect, useState } from "react";
import {
  Company,
  Equipment,
  FireExtinguisher,
  FirstAidKit,
  Machine,
  fetchEquipmentById,
  fetchFireExtinguisherById,
  fetchFirstAidKitById,
  fetchMachineById,
} from "../api";

export type AssetKind = "equipment" | "machine" | "extinguisher" | "firstAid";

type LoadedAsset =
  | { kind: "equipment"; data: Equipment }
  | { kind: "machine"; data: Machine }
  | { kind: "extinguisher"; data: FireExtinguisher }
  | { kind: "firstAid"; data: FirstAidKit };

interface AssetQrPageProps {
  token: string;
  companies: Company[];
  assetId: string | null;
  assetKind?: AssetKind | null;
  onBack?: () => void;
}

function isAssetKind(value: string | null): value is AssetKind {
  return value === "equipment" || value === "machine" || value === "extinguisher" || value === "firstAid";
}

function fetchByKind(token: string, kind: AssetKind, id: string): Promise<LoadedAsset> {
  if (kind === "equipment") return fetchEquipmentById(token, id).then((data) => ({ kind, data }));
  if (kind === "machine") return fetchMachineById(token, id).then((data) => ({ kind, data }));
  if (kind === "extinguisher") return fetchFireExtinguisherById(token, id).then((data) => ({ kind, data }));
  return fetchFirstAidKitById(token, id).then((data) => ({ kind: "firstAid", data }));
}

function kindLabel(kind: AssetKind): string {
  if (kind === "equipment") return "Attrezzatura";
  if (kind === "machine") return "Macchina";
  if (kind === "extinguisher") return "Estintore";
  return "Cassetta PS";
}

function displayName(loaded: LoadedAsset): string {
  if (loaded.kind === "equipment" || loaded.kind === "machine") return loaded.data.name;
  if (loaded.kind === "extinguisher") return loaded.data.code;
  return `Cassetta PS — ${loaded.data.location}`;
}

function nextCheckAt(loaded: LoadedAsset): string | null | undefined {
  if (loaded.kind === "machine") {
    // soonest fra manutenzione e safety check
    const a = loaded.data.nextMaintenanceAt;
    const b = loaded.data.nextSafetyCheckAt;
    if (a && b) return new Date(a).getTime() < new Date(b).getTime() ? a : b;
    return a ?? b ?? null;
  }
  return loaded.data.nextCheckAt;
}

export default function AssetQrPage({ token, companies, assetId, assetKind, onBack }: AssetQrPageProps) {
  const [loaded, setLoaded] = useState<LoadedAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Permetto sia prop esplicita sia query string `?id=...&kind=...` (compat retro).
    const search = new URLSearchParams(window.location.search);
    const idFromQuery = search.get("id");
    const kindFromQuery = search.get("kind");
    const id = assetId ?? idFromQuery;
    // Fallback default: equipment (mantengo behaviour storica per URL `?id=...` senza kind).
    const kind: AssetKind = assetKind ?? (isAssetKind(kindFromQuery) ? kindFromQuery : "equipment");
    if (!id) {
      setError("Nessun ID asset fornito.");
      setLoading(false);
      return;
    }
    void loadAsset(kind, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, assetKind, token]);

  async function loadAsset(kind: AssetKind, id: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchByKind(token, kind, id);
      setLoaded(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento asset.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <p>Caricamento...</p>;
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "crimson" }}>{error}</p>
        {onBack ? (
          <button className="ghost-btn" onClick={onBack}>
            ← Torna agli asset
          </button>
        ) : null}
      </div>
    );
  }
  if (!loaded) return <p>Asset non trovato.</p>;

  const company = companies.find((c) => c.id === loaded.data.companyId);
  const kind = loaded.kind;
  const name = displayName(loaded);
  const nextCheck = nextCheckAt(loaded);

  // Build a kind-aware QR payload + scan-back URL.
  const baseQrPayload: Record<string, unknown> = {
    id: loaded.data.id,
    kind,
    name,
    company: company?.name || loaded.data.companyId,
    url: `${window.location.origin}/asset?id=${loaded.data.id}&kind=${kind}`,
  };
  if (loaded.kind === "equipment" || loaded.kind === "machine") {
    baseQrPayload.serial = loaded.data.serialNumber ?? null;
    baseQrPayload.type = loaded.data.type;
  } else if (loaded.kind === "extinguisher") {
    baseQrPayload.code = loaded.data.code;
    baseQrPayload.type = loaded.data.type;
    baseQrPayload.manufactureDate = loaded.data.manufactureDate ?? null;
  } else {
    baseQrPayload.code = loaded.data.id;
  }
  const qrData = JSON.stringify(baseQrPayload);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;

  return (
    <div className="asset-qr-page" style={{ padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🏷️ QR Code {kindLabel(kind)}</h2>
        {onBack ? (
          <button className="ghost-btn" onClick={onBack}>
            ← Torna agli asset
          </button>
        ) : null}
      </header>

      <div
        style={{
          border: "2px dashed #bbb",
          borderRadius: 12,
          padding: 24,
          maxWidth: 400,
          margin: "24px auto",
          textAlign: "center",
          background: "#fafafa",
        }}
        className="qr-print-area"
      >
        <h3>{name}</h3>

        {loaded.kind === "equipment" || loaded.kind === "machine" ? (
          <p>
            <strong>Tipo:</strong> {loaded.data.type} | <strong>S/N:</strong>{" "}
            {loaded.data.serialNumber || "n/d"}
          </p>
        ) : null}

        {loaded.kind === "extinguisher" ? (
          <>
            <p>
              <strong>Codice:</strong> {loaded.data.code} | <strong>Tipo:</strong> {loaded.data.type}
            </p>
            <p>
              <strong>Costruzione:</strong>{" "}
              {loaded.data.manufactureDate
                ? new Date(loaded.data.manufactureDate).toLocaleDateString("it-IT")
                : "n/d"}
            </p>
          </>
        ) : null}

        {loaded.kind === "firstAid" ? (
          <p>
            <strong>Codice:</strong> {loaded.data.id.slice(0, 8)} | <strong>Tipo:</strong> Cassetta PS
          </p>
        ) : null}

        <p>
          <strong>Ubicazione:</strong> {loaded.data.location || "n/d"}
        </p>
        <p>
          <strong>Prossimo controllo:</strong>{" "}
          {nextCheck ? new Date(nextCheck).toLocaleDateString("it-IT") : "n/d"}
        </p>
        <p>
          <strong>Stato:</strong> {loaded.data.status}
        </p>
        <p>
          <strong>Azienda:</strong> {company?.name || loaded.data.companyId}
        </p>

        <div style={{ marginTop: 16 }}>
          <img
            src={qrUrl}
            alt="QR Code Asset"
            style={{ width: 200, height: 200, imageRendering: "pixelated" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
            Scansiona per dettagli asset
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button className="btn-primary" onClick={handlePrint}>
          🖨️ Stampa QR
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .qr-print-area, .qr-print-area * { visibility: visible; }
          .qr-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
