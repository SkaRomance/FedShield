import { useEffect, useState } from "react";
import { Company, Equipment, fetchEquipmentById } from "../api";

interface AssetQrPageProps {
  token: string;
  companies: Company[];
  assetId: string | null;
  onBack?: () => void;
}

export default function AssetQrPage({ token, companies, assetId, onBack }: AssetQrPageProps) {
  const [asset, setAsset] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Permetto sia prop esplicita sia query string `?id=...` (compat retro).
    const fromQuery = new URLSearchParams(window.location.search).get("id");
    const id = assetId ?? fromQuery;
    if (!id) {
      setError("Nessun ID asset fornito.");
      setLoading(false);
      return;
    }
    void loadAsset(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, token]);

  async function loadAsset(id: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEquipmentById(token, id);
      setAsset(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore caricamento asset.");
    } finally {
      setLoading(false);
    }
  }

  const company = companies.find((c) => c.id === asset?.companyId);

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
  if (!asset) return <p>Asset non trovato.</p>;

  const qrData = JSON.stringify({
    id: asset.id,
    serial: asset.serialNumber,
    name: asset.name,
    type: asset.type,
    company: company?.name || asset.companyId,
    url: `${window.location.origin}/asset?id=${asset.id}`,
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;

  return (
    <div className="asset-qr-page" style={{ padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>🏷️ QR Code Asset</h2>
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
        <h3>{asset.name}</h3>
        <p>
          <strong>Tipo:</strong> {asset.type} | <strong>S/N:</strong> {asset.serialNumber || "n/d"}
        </p>
        <p>
          <strong>Ubicazione:</strong> {asset.location || "n/d"}
        </p>
        <p>
          <strong>Prossimo controllo:</strong>{" "}
          {asset.nextCheckAt ? new Date(asset.nextCheckAt).toLocaleDateString("it-IT") : "n/d"}
        </p>
        <p>
          <strong>Stato:</strong> {asset.status}
        </p>
        <p>
          <strong>Azienda:</strong> {company?.name || asset.companyId}
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
