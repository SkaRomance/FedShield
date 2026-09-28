import GeoItalianPicker from "./GeoItalianPicker";

export interface CompanyFormData {
  code: string;
  name: string;
  vatNumber: string;
  fiscalCode: string;
  legalForm: string;
  reaNumber: string;
  employeesInfo: string;
  email: string;
  pec: string;
  phone: string;
  mobilePhone: string;
  atecoCode: string;
  riskLevel: string;
  province: string;
  city: string;
  cap: string;
  sdiCode: string;
  bankCoordinates: string;
  description: string;
  legalAddress: string;
  localUnitAddress: string;
}

export function emptyCompanyFormData(): CompanyFormData {
  return {
    code: "",
    name: "",
    vatNumber: "",
    fiscalCode: "",
    legalForm: "",
    reaNumber: "",
    employeesInfo: "",
    email: "",
    pec: "",
    phone: "",
    mobilePhone: "",
    atecoCode: "56.10.11",
    riskLevel: "",
    province: "",
    city: "",
    cap: "",
    sdiCode: "",
    bankCoordinates: "",
    description: "",
    legalAddress: "",
    localUnitAddress: "",
  };
}

interface CompanyDataFormProps {
  form: CompanyFormData;
  onChange: <K extends keyof CompanyFormData>(field: K, value: CompanyFormData[K]) => void;
  idPrefix?: string;
  disabled?: boolean;
}

export default function CompanyDataForm({
  form,
  onChange,
  idPrefix = "company",
  disabled = false,
}: CompanyDataFormProps) {
  function handleGeoChange(geo: { city: string; province: string; cap: string }) {
    onChange("city", geo.city);
    onChange("province", geo.province);
    onChange("cap", geo.cap);
  }

  return (
    <div className="company-data-form" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Sezione 1: Dati Fiscali e Identificazione */}
      <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: 8, padding: 14 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--color-primary, #212d52)", fontSize: "14px", fontWeight: 600 }}>
          1. Dati Fiscali e Identificazione (da Clienti.xlsx)
        </h4>
        <div className="grid-two">
          <div>
            <label htmlFor={`${idPrefix}-code`}>Cod. (Codice cliente)</label>
            <input
              id={`${idPrefix}-code`}
              value={form.code}
              disabled={disabled}
              placeholder="es. 0001"
              onChange={(e) => onChange("code", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-name`}>
              Denominazione / Ragione sociale <strong style={{ color: "var(--color-accent, #e65712)" }}>*</strong>
            </label>
            <input
              id={`${idPrefix}-name`}
              value={form.name}
              disabled={disabled}
              placeholder="es. SANTA CHIARA SOC. COOP. o RISTORANTE DEMO SRL"
              required
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-vat`}>
              Partita IVA <strong style={{ color: "var(--color-accent, #e65712)" }}>*</strong>
            </label>
            <input
              id={`${idPrefix}-vat`}
              value={form.vatNumber}
              disabled={disabled}
              placeholder="es. 03160240796"
              required
              onChange={(e) => onChange("vatNumber", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-fiscalcode`}>Codice fiscale</label>
            <input
              id={`${idPrefix}-fiscalcode`}
              value={form.fiscalCode}
              disabled={disabled}
              placeholder="es. 03160240796 oppure SPPCTN77P10F537W"
              onChange={(e) => onChange("fiscalCode", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-sdicode`}>Cod. destinatario (SDI)</label>
            <input
              id={`${idPrefix}-sdicode`}
              value={form.sdiCode}
              disabled={disabled}
              placeholder="es. 0000000 oppure W7YVJK9 (7 caratteri)"
              maxLength={7}
              onChange={(e) => onChange("sdiCode", e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-legalform`}>Forma giuridica</label>
            <input
              id={`${idPrefix}-legalform`}
              value={form.legalForm}
              disabled={disabled}
              placeholder="es. S.r.l., S.p.a., Ditta individuale, Coop..."
              onChange={(e) => onChange("legalForm", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-rea`}>Numero REA</label>
            <input
              id={`${idPrefix}-rea`}
              value={form.reaNumber}
              disabled={disabled}
              placeholder="es. VV-12345"
              onChange={(e) => onChange("reaNumber", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-employees`}>Totale dipendenti</label>
            <input
              id={`${idPrefix}-employees`}
              value={form.employeesInfo}
              disabled={disabled}
              placeholder="es. 5 dipendenti"
              onChange={(e) => onChange("employeesInfo", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sezione 2: Sede e Localizzazione con Comuni e Province */}
      <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: 8, padding: 14 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--color-primary, #212d52)", fontSize: "14px", fontWeight: 600 }}>
          2. Sede Legale e Localizzazione (Province e Comuni)
        </h4>
        <div className="grid-two">
          <div style={{ gridColumn: "span 2" }}>
            <label htmlFor={`${idPrefix}-legaladdr`}>Indirizzo (Sede legale)</label>
            <input
              id={`${idPrefix}-legaladdr`}
              value={form.legalAddress}
              disabled={disabled}
              placeholder="es. VIA LEONARDO SCIASCIA 24"
              onChange={(e) => onChange("legalAddress", e.target.value)}
            />
          </div>

          {/* Autocompletamento geografico Province e Comuni */}
          <GeoItalianPicker
            city={form.city}
            province={form.province}
            cap={form.cap}
            disabled={disabled}
            onChange={handleGeoChange}
          />

          <div style={{ gridColumn: "span 2" }}>
            <label htmlFor={`${idPrefix}-localaddr`}>Unità locale (Indirizzo operativo)</label>
            <input
              id={`${idPrefix}-localaddr`}
              value={form.localUnitAddress}
              disabled={disabled}
              placeholder="Indirizzo operativo del sopralluogo se diverso dalla sede legale"
              onChange={(e) => onChange("localUnitAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sezione 3: Recapiti e Contatti */}
      <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: 8, padding: 14 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--color-primary, #212d52)", fontSize: "14px", fontWeight: 600 }}>
          3. Recapiti e Contatti
        </h4>
        <div className="grid-two">
          <div>
            <label htmlFor={`${idPrefix}-phone`}>Tel. (Telefono fisso)</label>
            <input
              id={`${idPrefix}-phone`}
              value={form.phone}
              disabled={disabled}
              placeholder="es. 0963 123456"
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-mobilephone`}>Cell. (Cellulare)</label>
            <input
              id={`${idPrefix}-mobilephone`}
              value={form.mobilePhone}
              disabled={disabled}
              placeholder="es. 338/1051484 - 347/6740254"
              onChange={(e) => onChange("mobilePhone", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-email`}>e-mail (Email ordinaria)</label>
            <input
              id={`${idPrefix}-email`}
              type="email"
              value={form.email}
              disabled={disabled}
              placeholder="es. amministrazione@azienda.it"
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-pec`}>Pec (Posta Elettronica Certificata)</label>
            <input
              id={`${idPrefix}-pec`}
              type="email"
              value={form.pec}
              disabled={disabled}
              placeholder="es. azienda@pec.it"
              onChange={(e) => onChange("pec", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sezione 4: Coordinate Bancarie, ATECO e Note */}
      <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: 8, padding: 14 }}>
        <h4 style={{ margin: "0 0 10px 0", color: "var(--color-primary, #212d52)", fontSize: "14px", fontWeight: 600 }}>
          4. Coordinate Bancarie e Dati Operativi HSE
        </h4>
        <div className="grid-two">
          <div>
            <label htmlFor={`${idPrefix}-bankcoords`}>Coord. bancarie (IBAN)</label>
            <input
              id={`${idPrefix}-bankcoords`}
              value={form.bankCoordinates}
              disabled={disabled}
              placeholder="es. IT60X0542811101000000123456"
              onChange={(e) => onChange("bankCoordinates", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-ateco`}>Codice ATECO</label>
            <input
              id={`${idPrefix}-ateco`}
              value={form.atecoCode}
              disabled={disabled}
              placeholder="es. 56.10.11"
              onChange={(e) => onChange("atecoCode", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-risk`}>Livello di rischio</label>
            <select
              id={`${idPrefix}-risk`}
              value={form.riskLevel}
              disabled={disabled}
              onChange={(e) => onChange("riskLevel", e.target.value)}
            >
              <option value="">-- Seleziona livello rischio --</option>
              <option value="Basso">Basso</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${idPrefix}-desc`}>Descrizione / Note attività</label>
            <input
              id={`${idPrefix}-desc`}
              value={form.description}
              disabled={disabled}
              placeholder="Breve descrizione attività o note interne"
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
