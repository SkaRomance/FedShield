// Step 4 "Attrezzature e Macchinari" — Redesign Avanzato con Catalogo ATECO & Locali Censiti,
// Dati minimi obbligatori di legge (Costruttore, Modello, Matricola, Data di Installazione, Marcatura CE, Verifiche INAIL art. 71 c. 11),
// Scansioni Libretto d'Uso e Scheda Tecnica, Lavoratori Abilitati e collegamento con la Formazione Operatori (Accordo Stato-Regioni).

import { useEffect, useState, useMemo } from "react";
import {
  ChecklistItem,
  Equipment,
  fetchEquipmentPaged,
  fetchFireExtinguishersPaged,
  fetchFirstAidKitsPaged,
  fetchMachinesPaged,
  createMachine,
  updateMachine,
  deleteMachine,
  FireExtinguisher,
  FirstAidKit,
  Machine,
  Employee,
  fetchEmployees,
} from "../../api";
import EquipmentTab from "../assets/EquipmentTab";
import ExtinguishersTab from "../assets/ExtinguishersTab";
import FirstAidTab from "../assets/FirstAidTab";
import {
  workEnvironmentsStorageKey,
  getStandardEnvironmentsForAteco,
  WorkEnvironmentInstance,
} from "./normativePremisesCatalog";
import {
  getSectorMachineCatalogForAteco,
  parseMachineMetadata,
  serializeMachineMetadata,
  SectorMachineTemplate,
  MachineSafetyCheckDef,
  TRAINING_REQUIREMENTS_LIBRARY,
  MachineFullDetailsMetadata,
  getSuggestedMachinesForEnvironmentsAndAteco,
  SuggestedMachineWithEnvironment,
  MachineDocumentAttachment,
  getMandatoryDocumentaryChecksForMachine,
} from "./normativeMachineCatalog";
import { addMonthsToYmd } from "../../lib/deadlinesEngine";

export type AssetSubTab = "machines" | "equipment" | "extinguishers" | "firstAid";

interface Step4AssetAttrezzatureProps {
  token: string;
  companyId: string;
  onOpenQr: (assetId: string, kind: "equipment" | "machine" | "extinguisher" | "firstAid") => void;
  onAddCustomItems?: (
    items: Array<{
      section?: string;
      area: string;
      question: string;
      normReference?: string;
      defaultSeverity?: number;
      defaultSanctionable?: boolean;
      domain?: "safety" | "haccp" | "both";
    }>,
  ) => Promise<unknown>;
  existingChecklistItems?: ChecklistItem[];
  atecoCode?: string;
  isInspectionValidated?: boolean;
  inspectionId?: string;
}

export default function Step4AssetAttrezzature({
  token,
  companyId,
  onOpenQr,
  onAddCustomItems,
  existingChecklistItems = [],
  atecoCode,
  isInspectionValidated = false,
  inspectionId = "current",
}: Step4AssetAttrezzatureProps) {
  const [tab, setTab] = useState<AssetSubTab>("machines");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [extinguishers, setExtinguishers] = useState<FireExtinguisher[]>([]);
  const [firstAidKits, setFirstAidKits] = useState<FirstAidKit[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [integratingMachineId, setIntegratingMachineId] = useState<string | null>(null);

  // Modale inserimento/modifica macchina con tutti i dati minimi
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);

  // Form state per macchina
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formManufacturer, setFormManufacturer] = useState("");
  const [formModel, setFormModel] = useState("");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formBuildYear, setFormBuildYear] = useState<number | undefined>(new Date().getFullYear() - 2);
  const [formInstallationDate, setFormInstallationDate] = useState("");
  const [formCeStatus, setFormCeStatus] = useState<"ce_compliant" | "ante_ce_annex_v" | "non_compliant">("ce_compliant");
  // 4 Requisiti Documentali Obbligatori (Sì / No / Non Applicabile)
  const [formCeCertificationPresent, setFormCeCertificationPresent] = useState<"yes" | "no" | "na">("yes");
  const [formInstallationCompliant, setFormInstallationCompliant] = useState<"yes" | "no" | "na">("yes");
  const [formRiskAssessmentInDvr, setFormRiskAssessmentInDvr] = useState<"yes" | "no" | "na">("yes");
  const [formManualPresent, setFormManualPresent] = useState<"yes" | "no" | "na">("yes");
  const [formMaintenanceLogPresent, setFormMaintenanceLogPresent] = useState<"yes" | "no" | "expired">("yes");
  const [formLastMaintenanceDate, setFormLastMaintenanceDate] = useState("");
  const [formMaintenancePeriodicityMonths, setFormMaintenancePeriodicityMonths] = useState<number>(12);
  const [formNextMaintenanceDate, setFormNextMaintenanceDate] = useState("");
  const [formInailCheckRequired, setFormInailCheckRequired] = useState(false);
  const [formInailSerial, setFormInailSerial] = useState("");
  const [formInailPeriodicityMonths, setFormInailPeriodicityMonths] = useState<number>(12);
  const [formInailLastCheckDate, setFormInailLastCheckDate] = useState("");
  const [formInailNextCheckDate, setFormInailNextCheckDate] = useState("");
  const [formCeReleaseDate, setFormCeReleaseDate] = useState("");
  const [formInstallationCertifiedDate, setFormInstallationCertifiedDate] = useState("");
  const [formManualReleaseDate, setFormManualReleaseDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formEnvironmentName, setFormEnvironmentName] = useState("");
  const [formAuthorizedWorkerIds, setFormAuthorizedWorkerIds] = useState<string[]>([]);
  const [formAuthorizedCustomWorkers, setFormAuthorizedCustomWorkers] = useState("");
  const [formManualDoc, setFormManualDoc] = useState<MachineDocumentAttachment | undefined>(undefined);
  const [formTechSheetDoc, setFormTechSheetDoc] = useState<MachineDocumentAttachment | undefined>(undefined);
  const [formCeDeclDoc, setFormCeDeclDoc] = useState<MachineDocumentAttachment | undefined>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modale per aggiungere requisito personalizzato su una specifica macchina
  const [customReqModalMachine, setCustomReqModalMachine] = useState<Machine | null>(null);
  const [customReqQuestion, setCustomReqQuestion] = useState("");
  const [customReqNorm, setCustomReqNorm] = useState("");
  const [customReqSeverity, setCustomReqSeverity] = useState(3);
  const [customReqSanctionable, setCustomReqSanctionable] = useState(true);

  // Catalogo macchine suggerite per l'ATECO aziendale
  const sectorCatalog = useMemo(() => getSectorMachineCatalogForAteco(atecoCode), [atecoCode]);

  // Ambienti di lavoro registrati nello Step 2 (o standard di fallback)
  const environments = useMemo(() => {
    try {
      const key = workEnvironmentsStorageKey(inspectionId);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as WorkEnvironmentInstance[];
      }
    } catch {
      // ignore
    }
    return getStandardEnvironmentsForAteco(atecoCode);
  }, [inspectionId, atecoCode]);

  // Macchine suggerite incrociando sia i locali censiti che il settore ATECO
  const suggestedMachines = useMemo(
    () => getSuggestedMachinesForEnvironmentsAndAteco(environments, atecoCode),
    [environments, atecoCode],
  );

  const todayYmd = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (companyId) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

  async function reload() {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const [eq, ma, ex, kits, emps] = await Promise.all([
        fetchEquipmentPaged(token, { companyId }),
        fetchMachinesPaged(token, { companyId }),
        fetchFireExtinguishersPaged(token, { companyId }),
        fetchFirstAidKitsPaged(token, { companyId }),
        fetchEmployees(token, { companyId, isActive: true }).catch(() => []),
      ]);
      setEquipment(eq.items);
      setMachines(ma.items);
      setExtinguishers(ex.items);
      setFirstAidKits(kits.items);
      setEmployees(emps);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel caricamento dei beni e attrezzature");
    } finally {
      setLoading(false);
    }
  }

  // Gestione apertura/anteprima documento allegato
  function handleOpenDocument(doc?: MachineDocumentAttachment) {
    if (!doc?.dataUrl) return;
    const isPdf = doc.fileType.includes("pdf");
    const win = window.open();
    if (win) {
      if (isPdf) {
        win.document.write(
          `<iframe src="${doc.dataUrl}" frameborder="0" style="border:0; position:fixed; top:0; left:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      } else {
        win.document.write(
          `<html><head><title>${doc.fileName}</title></head><body style="margin:0; background:#0f172a; display:flex; justify-content:center; align-items:center; min-height:100vh;"><img src="${doc.dataUrl}" style="max-width:100%; max-height:100vh; object-fit:contain;" /></body></html>`
        );
      }
    } else {
      const a = document.createElement("a");
      a.href = doc.dataUrl;
      a.download = doc.fileName;
      a.click();
    }
  }

  // Gestione caricamento file scansionato (con limite 5MB)
  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "manual" | "techSheet" | "ceDecl",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Il file selezionato supera il limite massimo di 5MB. Seleziona una scansione o un PDF più compresso.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const attachment: MachineDocumentAttachment = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };
      if (target === "manual") setFormManualDoc(attachment);
      else if (target === "techSheet") setFormTechSheetDoc(attachment);
      else if (target === "ceDecl") setFormCeDeclDoc(attachment);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // Apertura form creazione macchina (opzionalmente con template)
  function handleOpenCreate(template?: SuggestedMachineWithEnvironment | SectorMachineTemplate) {
    setEditingMachine(null);
    const tmplWithEnv = template as SuggestedMachineWithEnvironment | undefined;
    const initialLocation = tmplWithEnv?.targetEnvironmentName || "";

    if (template) {
      setFormName(template.name);
      setFormType(template.type);
      setFormManufacturer(template.suggestedManufacturer);
      setFormModel(template.suggestedModel);
      setFormSerialNumber(`SN-${Math.floor(100000 + Math.random() * 900000)}`);
      setFormBuildYear(new Date().getFullYear() - 3);
      setFormInstallationDate(new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0]);
      setFormCeStatus("ce_compliant");
      setFormCeCertificationPresent("yes");
      setFormInstallationCompliant("yes");
      setFormRiskAssessmentInDvr("yes");
      setFormManualPresent("yes");
      const defaultLastMaint = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
      setFormLastMaintenanceDate(defaultLastMaint);
      setFormMaintenancePeriodicityMonths(12);
      setFormNextMaintenanceDate(addMonthsToYmd(defaultLastMaint, 12));
      setFormInailCheckRequired(template.isSubjectToInailCheck);
      setFormInailSerial(template.isSubjectToInailCheck ? `INAIL-${Math.floor(10000 + Math.random() * 90000)}` : "");
      setFormInailPeriodicityMonths(12);
      const defaultLastInail = template.isSubjectToInailCheck ? new Date(Date.now() - 180 * 86400000).toISOString().split("T")[0] : "";
      setFormInailLastCheckDate(defaultLastInail);
      setFormInailNextCheckDate(defaultLastInail ? addMonthsToYmd(defaultLastInail, 12) : "");
      setFormCeReleaseDate("");
      setFormInstallationCertifiedDate("");
      setFormManualReleaseDate("");
      setFormLocation(initialLocation);
      setFormEnvironmentName(initialLocation);
      setFormAuthorizedWorkerIds([]);
      setFormAuthorizedCustomWorkers("");
      setFormManualDoc(undefined);
      setFormTechSheetDoc(undefined);
      setFormCeDeclDoc(undefined);
    } else {
      setFormName("");
      setFormType("Macchina / Impianto");
      setFormManufacturer("");
      setFormModel("");
      setFormSerialNumber("");
      setFormBuildYear(new Date().getFullYear() - 1);
      setFormInstallationDate(new Date().toISOString().split("T")[0]);
      setFormCeStatus("ce_compliant");
      setFormCeCertificationPresent("yes");
      setFormInstallationCompliant("yes");
      setFormRiskAssessmentInDvr("yes");
      setFormManualPresent("yes");
      setFormMaintenanceLogPresent("yes");
      const defaultLastMaint = new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0];
      setFormLastMaintenanceDate(defaultLastMaint);
      setFormMaintenancePeriodicityMonths(12);
      setFormNextMaintenanceDate(addMonthsToYmd(defaultLastMaint, 12));
      setFormInailCheckRequired(false);
      setFormInailSerial("");
      setFormInailPeriodicityMonths(12);
      setFormInailLastCheckDate("");
      setFormInailNextCheckDate("");
      setFormCeReleaseDate("");
      setFormInstallationCertifiedDate("");
      setFormManualReleaseDate("");
      setFormLocation("");
      setFormEnvironmentName("");
      setFormAuthorizedWorkerIds([]);
      setFormAuthorizedCustomWorkers("");
      setFormManualDoc(undefined);
      setFormTechSheetDoc(undefined);
      setFormCeDeclDoc(undefined);
    }
    setShowMachineModal(true);
  }

  // Apertura form modifica macchina
  function handleOpenEdit(m: Machine) {
    setEditingMachine(m);
    const meta = parseMachineMetadata(m.note);
    setFormName(m.name);
    setFormType(m.type);
    setFormManufacturer(m.manufacturer || "");
    setFormModel(m.model || "");
    setFormSerialNumber(m.serialNumber || "");
    setFormLocation(m.location || meta.environmentName || "");
    setFormEnvironmentName(meta.environmentName || m.location || "");
    setFormBuildYear(meta.buildYear ?? new Date().getFullYear() - 2);
    setFormInstallationDate(meta.installationDate || "");
    setFormCeStatus(meta.ceStatus ?? "ce_compliant");
    setFormCeCertificationPresent(meta.ceCertificationPresent ?? (meta.ceStatus === "non_compliant" ? "no" : "yes"));
    setFormInstallationCompliant(meta.installationCompliant ?? "yes");
    setFormRiskAssessmentInDvr(meta.riskAssessmentInDvr ?? "yes");
    setFormManualPresent(meta.manualPresent ?? (meta.manualDocument ? "yes" : "yes"));
    setFormMaintenanceLogPresent(meta.maintenanceLogPresent ?? "yes");

    const maintPeriod = meta.maintenancePeriodicityMonths || 12;
    const lastMaint = meta.lastMaintenanceDate || (m.lastMaintenanceAt ? m.lastMaintenanceAt.slice(0, 10) : "");
    const nextMaint = meta.nextMaintenanceDate || (m.nextMaintenanceAt ? m.nextMaintenanceAt.slice(0, 10) : "") || (lastMaint ? addMonthsToYmd(lastMaint, maintPeriod) : "");
    setFormLastMaintenanceDate(lastMaint);
    setFormMaintenancePeriodicityMonths(maintPeriod);
    setFormNextMaintenanceDate(nextMaint);

    const inailPeriod = meta.inailPeriodicityMonths || 12;
    const lastInail = meta.inailLastCheckDate || (m.lastSafetyCheckAt ? m.lastSafetyCheckAt.slice(0, 10) : "");
    const nextInail = meta.inailNextCheckDate || (m.nextSafetyCheckAt ? m.nextSafetyCheckAt.slice(0, 10) : "") || (lastInail ? addMonthsToYmd(lastInail, inailPeriod) : "");
    setFormInailCheckRequired(meta.inailCheckRequired ?? false);
    setFormInailSerial(meta.inailSerial || "");
    setFormInailPeriodicityMonths(inailPeriod);
    setFormInailLastCheckDate(lastInail);
    setFormInailNextCheckDate(nextInail);

    setFormCeReleaseDate(meta.ceReleaseDate || "");
    setFormInstallationCertifiedDate(meta.installationCertifiedDate || "");
    setFormManualReleaseDate(meta.manualReleaseDate || "");
    setFormAuthorizedWorkerIds(meta.authorizedWorkerIds || []);
    setFormAuthorizedCustomWorkers((meta.authorizedWorkerNames || []).join(", "));
    setFormManualDoc(meta.manualDocument);
    setFormTechSheetDoc(meta.technicalSheetDocument);
    setFormCeDeclDoc(meta.ceDeclarationDocument);
    setShowMachineModal(true);
  }

  // Aggiornamento rapido con un clic dello stato documentale direttamente dalla scheda della macchina
  async function handleQuickUpdateDocumentaryStatus(
    m: Machine,
    field: "ceCertificationPresent" | "installationCompliant" | "riskAssessmentInDvr" | "manualPresent",
    value: "yes" | "no" | "na",
  ) {
    const meta = parseMachineMetadata(m.note);
    const updatedMeta: MachineFullDetailsMetadata = {
      ...meta,
      [field]: value,
    };
    // Se la certificazione CE passa a "no", aggiorniamo coerentemente anche ceStatus
    if (field === "ceCertificationPresent") {
      if (value === "no") updatedMeta.ceStatus = "non_compliant";
      else if (value === "yes" && meta.ceStatus === "non_compliant") updatedMeta.ceStatus = "ce_compliant";
    }
    const serialized = serializeMachineMetadata(updatedMeta);
    try {
      await updateMachine(token, m.id, {
        note: serialized,
      });
      setMachines((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, note: serialized } : item)),
      );
      setActionMessage(`✓ Requisito documentale aggiornato per "${m.name}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore aggiornamento requisito documentale");
    }
  }

  // Eliminazione macchina
  async function handleDeleteMachine(m: Machine) {
    if (!window.confirm(`Sei sicuro di voler eliminare la macchina "${m.name}" dal sopralluogo?`)) return;
    setError(null);
    try {
      await deleteMachine(token, m.id);
      setActionMessage(`Macchina "${m.name}" eliminata dal censimento.`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'eliminazione della macchina.");
    }
  }

  // Salvataggio macchina (nuova o modifica)
  async function handleSaveMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Il nome della macchina è obbligatorio.");
      return;
    }

    setFormSubmitting(true);
    setError(null);
    try {
      // Identifica il template corrispondente per agganciare il corso di formazione
      const matchingTemplate = sectorCatalog.machines.find((t) => t.name.toLowerCase() === formName.toLowerCase())
        || sectorCatalog.machines[0];
      const training = matchingTemplate ? matchingTemplate.training : TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche;

      // Preserva eventuali requisiti personalizzati già presenti
      const existingMeta = editingMachine ? parseMachineMetadata(editingMachine.note) : {};

      const customNames = formAuthorizedCustomWorkers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const metadata: MachineFullDetailsMetadata = {
        buildYear: formBuildYear,
        installationDate: formInstallationDate || undefined,
        ceStatus: formCeStatus,
        ceCertificationPresent: formCeCertificationPresent,
        ceReleaseDate: formCeReleaseDate || undefined,
        installationCompliant: formInstallationCompliant,
        installationCertifiedDate: formInstallationCertifiedDate || undefined,
        riskAssessmentInDvr: formRiskAssessmentInDvr,
        manualPresent: formManualDoc ? "yes" : formManualPresent,
        manualReleaseDate: formManualReleaseDate || undefined,
        maintenanceLogPresent: formMaintenanceLogPresent,
        lastMaintenanceDate: formLastMaintenanceDate || undefined,
        maintenancePeriodicityMonths: formMaintenancePeriodicityMonths,
        nextMaintenanceDate: formNextMaintenanceDate || undefined,
        inailCheckRequired: formInailCheckRequired,
        inailSerial: formInailSerial.trim() || undefined,
        inailPeriodicityMonths: formInailPeriodicityMonths,
        inailLastCheckDate: formInailLastCheckDate || undefined,
        inailNextCheckDate: formInailNextCheckDate || undefined,
        requiredCourseCode: training.courseCode,
        requiredCourseTitle: training.courseTitle,
        environmentName: formEnvironmentName.trim() || formLocation.trim() || undefined,
        authorizedWorkerIds: formAuthorizedWorkerIds,
        authorizedWorkerNames: customNames,
        manualDocument: formManualDoc,
        technicalSheetDocument: formTechSheetDoc,
        ceDeclarationDocument: formCeDeclDoc,
        customRequirements: existingMeta.customRequirements,
      };

      const serializedNote = serializeMachineMetadata(metadata);

      const payload = {
        name: formName.trim(),
        type: formType.trim() || "Macchina",
        manufacturer: formManufacturer.trim() || undefined,
        model: formModel.trim() || undefined,
        serialNumber: formSerialNumber.trim() || undefined,
        location: formEnvironmentName.trim() || formLocation.trim() || undefined,
        note: serializedNote,
        lastMaintenanceAt: formLastMaintenanceDate ? new Date(formLastMaintenanceDate).toISOString() : undefined,
        nextMaintenanceAt: formNextMaintenanceDate ? new Date(formNextMaintenanceDate).toISOString() : undefined,
        lastSafetyCheckAt: formInailLastCheckDate ? new Date(formInailLastCheckDate).toISOString() : undefined,
        nextSafetyCheckAt: formInailNextCheckDate ? new Date(formInailNextCheckDate).toISOString() : undefined,
      };

      if (editingMachine) {
        await updateMachine(token, editingMachine.id, payload);
        setActionMessage(`Macchina "${payload.name}" aggiornata con successo.`);
      } else {
        await createMachine(token, { companyId, ...payload });
        setActionMessage(`Macchina "${payload.name}" censita nel sopralluogo.`);
      }

      setShowMachineModal(false);
      setEditingMachine(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel salvataggio della macchina.");
    } finally {
      setFormSubmitting(false);
    }
  }

  // Precarica in blocco le macchine tipiche incrociate per locali e settore ATECO
  async function handlePreloadSectorMachines() {
    if (
      !window.confirm(
        `Vuoi precaricare le ${suggestedMachines.length} attrezzature consigliate per i tuoi locali censiti e il settore "${sectorCatalog.sectorLabel}"?`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      for (const t of suggestedMachines) {
        // Verifica se esiste già per nome
        const already = machines.some((m) => m.name.toLowerCase() === t.name.toLowerCase());
        if (already) continue;

        const defaultLastMaint = new Date(Date.now() - 120 * 86400000).toISOString().split("T")[0];
        const defaultNextMaint = addMonthsToYmd(defaultLastMaint, 12);
        const meta: MachineFullDetailsMetadata = {
          buildYear: new Date().getFullYear() - 2,
          installationDate: new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0],
          ceStatus: "ce_compliant",
          manualPresent: "yes",
          maintenanceLogPresent: "yes",
          lastMaintenanceDate: defaultLastMaint,
          maintenancePeriodicityMonths: 12,
          nextMaintenanceDate: defaultNextMaint,
          inailCheckRequired: t.isSubjectToInailCheck,
          inailSerial: t.isSubjectToInailCheck ? `INAIL-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
          inailPeriodicityMonths: 12,
          inailLastCheckDate: t.isSubjectToInailCheck ? new Date(Date.now() - 120 * 86400000).toISOString().split("T")[0] : undefined,
          inailNextCheckDate: t.isSubjectToInailCheck ? new Date(Date.now() + 245 * 86400000).toISOString().split("T")[0] : undefined,
          requiredCourseCode: t.training.courseCode,
          requiredCourseTitle: t.training.courseTitle,
          environmentName: t.targetEnvironmentName,
        };

        await createMachine(token, {
          companyId,
          name: t.name,
          type: t.type,
          manufacturer: t.suggestedManufacturer,
          model: t.suggestedModel,
          serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
          location: t.targetEnvironmentName,
          note: serializeMachineMetadata(meta),
          lastMaintenanceAt: new Date(defaultLastMaint).toISOString(),
          nextMaintenanceAt: new Date(defaultNextMaint).toISOString(),
          lastSafetyCheckAt: meta.inailLastCheckDate ? new Date(meta.inailLastCheckDate).toISOString() : undefined,
          nextSafetyCheckAt: meta.inailNextCheckDate ? new Date(meta.inailNextCheckDate).toISOString() : undefined,
        });
      }

      setActionMessage(`✓ Attrezzature consigliate per i tuoi locali (${suggestedMachines.length}) precaricate con successo!`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il precaricamento.");
    } finally {
      setLoading(false);
    }
  }

  // Aggiunge un requisito personalizzato alla singola macchina
  async function handleAddCustomRequirementToMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!customReqModalMachine || !customReqQuestion.trim()) return;

    try {
      const meta = parseMachineMetadata(customReqModalMachine.note);
      const newReq: MachineSafetyCheckDef = {
        code: `CUSTOM_${Date.now()}`,
        title: customReqQuestion.trim().substring(0, 40),
        question: customReqQuestion.trim(),
        normReference: customReqNorm.trim() || "D.Lgs. 81/2008 Titolo III",
        defaultSeverity: customReqSeverity,
        defaultSanctionable: customReqSanctionable,
      };

      const customList = meta.customRequirements || [];
      customList.push(newReq);
      meta.customRequirements = customList;

      await updateMachine(token, customReqModalMachine.id, {
        note: serializeMachineMetadata(meta),
      });

      // Se disponibile, aggiunge anche alla checklist globale
      if (onAddCustomItems) {
        await onAddCustomItems([
          {
            section: "premises_equipment",
            domain: "safety",
            area: `Sicurezza Macchine - ${customReqModalMachine.name}`,
            question: newReq.question,
            normReference: newReq.normReference,
            defaultSeverity: newReq.defaultSeverity,
            defaultSanctionable: newReq.defaultSanctionable,
          },
        ]);
      }

      setActionMessage(`✓ Requisito personalizzato aggiunto a "${customReqModalMachine.name}" e incluso nella checklist!`);
      setCustomReqModalMachine(null);
      setCustomReqQuestion("");
      setCustomReqNorm("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore aggiunta requisito personalizzato.");
    }
  }

  // 1. Requisiti documentali obbligatori di legge (CE, Regola d'arte, DVR, Libretto uso e manutenzione)
  function getDocumentaryChecksForMachine(m: Machine): MachineSafetyCheckDef[] {
    return getMandatoryDocumentaryChecksForMachine(m.name);
  }

  // 2. Controlli tecnici operativi specifici della macchina (organi in movimento, carter, emergenza, ecc.)
  function getSpecificSafetyChecksForMachine(m: Machine): MachineSafetyCheckDef[] {
    const meta = parseMachineMetadata(m.note);
    const custom = meta.customRequirements || [];

    const matchedTemplate = sectorCatalog.machines.find(
      (t) => t.name.toLowerCase() === m.name.toLowerCase() || m.name.toLowerCase().includes(t.machineKey),
    );

    const defaultSpecific: MachineSafetyCheckDef[] = [
      {
        code: "GUARDS_AND_INTERLOCKS",
        title: "Ripari e Dispositivi di Sicurezza Organi in Movimento",
        question: `Tutti gli organi mobili e le zone di pericolo di ${m.name} sono dotati di ripari fissi o mobili, carter e microinterruttori di sicurezza efficienti contro il contatto o trascinamento?`,
        normReference: "D.Lgs. 81/2008, All. V, parte I, p. 6 e All. VI",
        defaultSeverity: 4,
        defaultSanctionable: true,
      },
      {
        code: "EMERGENCY_STOP",
        title: "Dispositivo di Arresto di Emergenza",
        question: `La macchina ${m.name} è provvista di dispositivo di arresto di emergenza ad azione rapida (fungo d'emergenza), chiaramente individuabile, accessibile e funzionante?`,
        normReference: "D.Lgs. 81/2008, All. V, parte I, p. 2",
        defaultSeverity: 3,
        defaultSanctionable: true,
      },
      {
        code: "MAINTENANCE_LOG",
        title: "Registro Manutenzioni e Controlli Periodici",
        question: `Gli interventi di manutenzione programmata, la pulizia e le verifiche periodiche di sicurezza su ${m.name} sono puntualmente eseguiti e registrati sull'apposito registro?`,
        normReference: "D.Lgs. 81/2008, art. 71 c. 4 e c. 8",
        defaultSeverity: 2,
        defaultSanctionable: true,
      },
    ];

    const specific = matchedTemplate ? matchedTemplate.safetyChecks : defaultSpecific;
    return [...specific, ...custom];
  }

  // Tutti i controlli per la checklist (Requisiti Documentali + Controlli Tecnici Specifici)
  function getChecksForMachine(m: Machine): MachineSafetyCheckDef[] {
    return [...getDocumentaryChecksForMachine(m), ...getSpecificSafetyChecksForMachine(m)];
  }

  // Trova il requisito formativo obbligatorio collegato alla macchina
  function getTrainingForMachine(m: Machine) {
    const meta = parseMachineMetadata(m.note);
    if (meta.requiredCourseTitle) {
      return {
        courseCode: meta.requiredCourseCode || "FORMAZ_ATTREZZATURE",
        courseTitle: meta.requiredCourseTitle,
        normReference: "D.Lgs. 81/2008 art. 73",
        minHours: 4,
        frequencyYears: 5,
        requiresPatentinoAccordoSR: false,
      };
    }

    const matchedTemplate = sectorCatalog.machines.find(
      (t) => t.name.toLowerCase() === m.name.toLowerCase() || m.name.toLowerCase().includes(t.machineKey),
    );

    return matchedTemplate ? matchedTemplate.training : TRAINING_REQUIREMENTS_LIBRARY.attrezzature_generiche;
  }

  if (!companyId) {
    return (
      <div className="panel section-panel">
        <h3>Attrezzature e Macchinari</h3>
        <p>Seleziona o crea prima un'azienda al passo &quot;Dati Azienda&quot; per procedere con il censimento.</p>
      </div>
    );
  }

  return (
    <div className="panel section-panel" style={{ padding: "20px" }}>
      {/* Header principale */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "var(--color-primary, #0f172a)" }}>
            Attrezzature, Macchinari e Impianti Aziendali
          </h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Censimento macchinari con dati minimi di legge, marcatura CE, verifiche INAIL art. 71 c. 11, controlli di sicurezza specifici e formazione operatori (Accordo Stato-Regioni).
          </p>
        </div>

        {/* Pulsanti Azione Rapida */}
        {!isInspectionValidated && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {machines.length === 0 && (
              <button
                type="button"
                className="button"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={handlePreloadSectorMachines}
              >
                ⚡ Precarica Attrezzature del Settore ({sectorCatalog.machines.length})
              </button>
            )}

            <button
              type="button"
              className="button"
              style={{
                backgroundColor: "var(--color-primary, #0f172a)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => handleOpenCreate()}
            >
              ➕ Aggiungi Macchinario
            </button>
          </div>
        )}
      </div>

      {/* Barra Sottoschede */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #e2e8f0" }}>
        <button
          type="button"
          onClick={() => setTab("machines")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "machines" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "machines" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "machines" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🚜 Macchine & Impianti ({machines.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("equipment")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "equipment" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "equipment" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "equipment" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🔧 Attrezzature Minori ({equipment.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("extinguishers")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "extinguishers" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "extinguishers" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "extinguishers" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🧯 Estintori ({extinguishers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("firstAid")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderBottom: tab === "firstAid" ? "3px solid var(--color-primary, #0f172a)" : "3px solid transparent",
            backgroundColor: "transparent",
            color: tab === "firstAid" ? "var(--color-primary, #0f172a)" : "#64748b",
            fontWeight: tab === "firstAid" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>🩹 Cassette PS ({firstAidKits.length})</span>
        </button>
      </div>

      {actionMessage && (
        <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px", fontWeight: 600 }}>
          {actionMessage}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "14px" }}>
          {error}
        </div>
      )}

      {loading && <p style={{ color: "#64748b" }}>Caricamento dati attrezzature in corso...</p>}

      {/* ============================================================== */}
      {/* SCHEDA 1: MACCHINE & IMPIANTI CON DATI MINIMI E REQUISITI      */}
      {/* ============================================================== */}
      {tab === "machines" && (
        <div>
          {/* Banner Settore ATECO & Ambienti Censiti Rilevati */}
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "12px", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>
                  SETTORE ATECO & AMBIENTI CENSITI
                </span>
                <span
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#15803d",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  {suggestedMachines.length} macchine consigliate
                </span>
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#14532d", marginTop: 2 }}>
                {sectorCatalog.sectorLabel} {atecoCode ? `(ATECO ${atecoCode})` : ""}
              </div>

              {/* Badges Ambienti di lavoro presenti */}
              {environments.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                  <span style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>Locali attivi:</span>
                  {environments.map((env) => (
                    <span
                      key={env.id || env.name}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #86efac",
                        color: "#166534",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      🏢 {env.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Rapido: Scegli dalla libreria macchine consigliate per i locali */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <select
                disabled={isInspectionValidated}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const tmpl = suggestedMachines.find((m) => m.machineKey === val);
                  if (tmpl) handleOpenCreate(tmpl);
                  e.target.value = "";
                }}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #86efac", fontSize: "13px", fontWeight: 600, backgroundColor: "#fff" }}
              >
                <option value="">➕ Scegli macchina consigliata dal catalogo...</option>
                {suggestedMachines.map((tm, sIdx) => (
                  <option key={`${tm.machineKey}_${sIdx}`} value={tm.machineKey}>
                    {tm.targetEnvironmentName ? `[${tm.targetEnvironmentName}] ` : ""}{tm.name} ({tm.suggestedManufacturer})
                  </option>
                ))}
              </select>

              {!isInspectionValidated && machines.length === 0 && (
                <button
                  type="button"
                  onClick={handlePreloadSectorMachines}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: 6,
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⚡ Precarica Tutte ({suggestedMachines.length})
                </button>
              )}
            </div>
          </div>

          {/* Elenco Macchine Censite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {machines.map((m) => {
              const meta = parseMachineMetadata(m.note);
              const docChecks = getDocumentaryChecksForMachine(m);
              const specChecks = getSpecificSafetyChecksForMachine(m);
              const checks = [...docChecks, ...specChecks];
              const training = getTrainingForMachine(m);

              // Valori correnti dei 4 requisiti documentali per la macchina
              const ceStatusVal = meta.ceCertificationPresent ?? (meta.ceStatus === "non_compliant" ? "no" : "yes");
              const instStatusVal = meta.installationCompliant ?? "yes";
              const dvrStatusVal = meta.riskAssessmentInDvr ?? "yes";
              const manualStatusVal = meta.manualPresent ?? (meta.manualDocument ? "yes" : "yes");

              const isIncludedInChecklist = existingChecklistItems.some(
                (it) => it.area.toLowerCase() === `Sicurezza Macchine - ${m.name}`.toLowerCase(),
              );

              return (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "18px 20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Riga Superiore: Dati Anagrafici Principali e Azioni */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h4 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>{m.name}</h4>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {m.type}
                        </span>
                        {(meta.environmentName || m.location) && (
                          <span
                            style={{
                              backgroundColor: "#e0f2fe",
                              color: "#0369a1",
                              border: "1px solid #bae6fd",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            📍 {meta.environmentName || m.location}
                          </span>
                        )}
                      </div>

                      {/* Riga Dati Minimi: Costruttore, Modello, Matricola, Anno, Data Installazione */}
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "center",
                          flexWrap: "wrap",
                          marginTop: 6,
                          fontSize: "13px",
                          color: "#334155",
                        }}
                      >
                        <div>
                          <strong>Costruttore:</strong> {m.manufacturer || "Non indicato"}
                        </div>
                        <div>
                          <strong>Modello:</strong> {m.model || "Standard"}
                        </div>
                        <div>
                          <strong>Matricola:</strong>{" "}
                          <span style={{ fontFamily: "monospace", backgroundColor: "#f8fafc", padding: "1px 6px", borderRadius: 4, border: "1px solid #cbd5e1" }}>
                            {m.serialNumber || "N/D"}
                          </span>
                        </div>
                        <div>
                          <strong>Anno:</strong> {meta.buildYear || "—"}
                        </div>
                        {meta.installationDate && (
                          <div>
                            <strong>Data Installazione:</strong> {meta.installationDate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Azioni Modifica / Elimina / QR */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => onOpenQr(m.id, "machine")}
                        style={{
                          backgroundColor: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          padding: "6px 10px",
                          borderRadius: 6,
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                        title="Genera QR Code"
                      >
                        📱 QR
                      </button>
                      {!isInspectionValidated && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            style={{
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#334155",
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✏️ Modifica
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMachine(m)}
                            style={{
                              backgroundColor: "#fee2e2",
                              border: "1px solid #fca5a5",
                              color: "#b91c1c",
                              padding: "6px 10px",
                              borderRadius: 6,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            title="Elimina macchina dal sopralluogo"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* BOX REQUISITI DOCUMENTALI OBBLIGATORI (D.Lgs. 81/08 Titolo III) */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      padding: "12px 14px",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "16px" }}>📄</span>
                        <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                          Requisiti Documentali Obbligatori (D.Lgs. 81/08 Titolo III):
                        </strong>
                      </div>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Clicca per impostare con un tocco lo stato di conformità (Sì / No / Non Applicabile)
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {/* 1. Presenza Certificazione CE */}
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: `1px solid ${ceStatusVal === "yes" ? "#86efac" : ceStatusVal === "no" ? "#fca5a5" : "#cbd5e1"}`,
                          borderRadius: 6,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
                              1. Certificazione / Marcatura CE
                            </div>
                            <span style={{ fontSize: "10px", padding: "1px 5px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                              🛡️ Permanente (senza scadenza)
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {meta.ceStatus === "ce_compliant" ? "Marcata CE (Direttiva Macchine)" : meta.ceStatus === "ante_ce_annex_v" ? "Ante-CE (All. V D.Lgs. 81/08)" : "Marcatura non conforme"}
                          </div>
                          {meta.ceDeclarationDocument && (
                            <button
                              type="button"
                              onClick={() => handleOpenDocument(meta.ceDeclarationDocument)}
                              style={{ marginTop: 4, padding: "2px 6px", fontSize: "10px", borderRadius: 4, border: "none", backgroundColor: "#7c3aed", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                            >
                              🛡️ Apri Dichiarazione CE ({meta.ceDeclarationDocument.fileName})
                            </button>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "ceCertificationPresent", "yes")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: ceStatusVal === "yes" ? "1px solid #16a34a" : "1px solid #cbd5e1",
                              backgroundColor: ceStatusVal === "yes" ? "#dcfce7" : "#fff",
                              color: ceStatusVal === "yes" ? "#15803d" : "#64748b",
                            }}
                          >
                            ✓ Sì
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "ceCertificationPresent", "no")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: ceStatusVal === "no" ? "1px solid #dc2626" : "1px solid #cbd5e1",
                              backgroundColor: ceStatusVal === "no" ? "#fee2e2" : "#fff",
                              color: ceStatusVal === "no" ? "#b91c1c" : "#64748b",
                            }}
                          >
                            ✗ No
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "ceCertificationPresent", "na")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: ceStatusVal === "na" ? "1px solid #64748b" : "1px solid #cbd5e1",
                              backgroundColor: ceStatusVal === "na" ? "#f1f5f9" : "#fff",
                              color: ceStatusVal === "na" ? "#334155" : "#64748b",
                            }}
                          >
                            — N/A
                          </button>
                        </div>
                      </div>

                      {/* 2. Installazione a Regola d'Arte */}
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: `1px solid ${instStatusVal === "yes" ? "#86efac" : instStatusVal === "no" ? "#fca5a5" : "#cbd5e1"}`,
                          borderRadius: 6,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
                              2. Installazione a Regola d&apos;Arte
                            </div>
                            <span style={{ fontSize: "10px", padding: "1px 5px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                              🛡️ Permanente (senza scadenza)
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            art. 71 c. 3 — Fissaggi, allacciamenti e spazi idonei a norma
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "installationCompliant", "yes")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: instStatusVal === "yes" ? "1px solid #16a34a" : "1px solid #cbd5e1",
                              backgroundColor: instStatusVal === "yes" ? "#dcfce7" : "#fff",
                              color: instStatusVal === "yes" ? "#15803d" : "#64748b",
                            }}
                          >
                            ✓ Sì
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "installationCompliant", "no")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: instStatusVal === "no" ? "1px solid #dc2626" : "1px solid #cbd5e1",
                              backgroundColor: instStatusVal === "no" ? "#fee2e2" : "#fff",
                              color: instStatusVal === "no" ? "#b91c1c" : "#64748b",
                            }}
                          >
                            ✗ No
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "installationCompliant", "na")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: instStatusVal === "na" ? "1px solid #64748b" : "1px solid #cbd5e1",
                              backgroundColor: instStatusVal === "na" ? "#f1f5f9" : "#fff",
                              color: instStatusVal === "na" ? "#334155" : "#64748b",
                            }}
                          >
                            — N/A
                          </button>
                        </div>
                      </div>

                      {/* 3. Valutazione Rischi Inserita nel DVR */}
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: `1px solid ${dvrStatusVal === "yes" ? "#86efac" : dvrStatusVal === "no" ? "#fca5a5" : "#cbd5e1"}`,
                          borderRadius: 6,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
                            3. Valutazione Rischi Inserita nel DVR
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            art. 17 e 28 — Rischi d&apos;uso, manutenzione e pulizia valutati nel DVR
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "riskAssessmentInDvr", "yes")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: dvrStatusVal === "yes" ? "1px solid #16a34a" : "1px solid #cbd5e1",
                              backgroundColor: dvrStatusVal === "yes" ? "#dcfce7" : "#fff",
                              color: dvrStatusVal === "yes" ? "#15803d" : "#64748b",
                            }}
                          >
                            ✓ Sì
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "riskAssessmentInDvr", "no")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: dvrStatusVal === "no" ? "1px solid #dc2626" : "1px solid #cbd5e1",
                              backgroundColor: dvrStatusVal === "no" ? "#fee2e2" : "#fff",
                              color: dvrStatusVal === "no" ? "#b91c1c" : "#64748b",
                            }}
                          >
                            ✗ No
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "riskAssessmentInDvr", "na")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: dvrStatusVal === "na" ? "1px solid #64748b" : "1px solid #cbd5e1",
                              backgroundColor: dvrStatusVal === "na" ? "#f1f5f9" : "#fff",
                              color: dvrStatusVal === "na" ? "#334155" : "#64748b",
                            }}
                          >
                            — N/A
                          </button>
                        </div>
                      </div>

                      {/* 4. Presenza Libretto Uso e Manutenzione */}
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: `1px solid ${manualStatusVal === "yes" ? "#86efac" : manualStatusVal === "no" ? "#fca5a5" : "#cbd5e1"}`,
                          borderRadius: 6,
                          padding: "8px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
                              4. Libretto d&apos;Uso e Manutenzione
                            </div>
                            <span style={{ fontSize: "10px", padding: "1px 5px", borderRadius: 4, backgroundColor: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                              🛡️ Permanente (senza scadenza)
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            art. 70 c. 2 — Manuale in italiano disponibile e consultabile
                          </div>
                          {meta.manualDocument && (
                            <button
                              type="button"
                              onClick={() => handleOpenDocument(meta.manualDocument)}
                              style={{ marginTop: 4, padding: "2px 6px", fontSize: "10px", borderRadius: 4, border: "none", backgroundColor: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 600 }}
                            >
                              📖 Apri Libretto Scansionato ({meta.manualDocument.fileName})
                            </button>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "manualPresent", "yes")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: manualStatusVal === "yes" ? "1px solid #16a34a" : "1px solid #cbd5e1",
                              backgroundColor: manualStatusVal === "yes" ? "#dcfce7" : "#fff",
                              color: manualStatusVal === "yes" ? "#15803d" : "#64748b",
                            }}
                          >
                            ✓ Sì
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "manualPresent", "no")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: manualStatusVal === "no" ? "1px solid #dc2626" : "1px solid #cbd5e1",
                              backgroundColor: manualStatusVal === "no" ? "#fee2e2" : "#fff",
                              color: manualStatusVal === "no" ? "#b91c1c" : "#64748b",
                            }}
                          >
                            ✗ No
                          </button>
                          <button
                            type="button"
                            disabled={isInspectionValidated}
                            onClick={() => handleQuickUpdateDocumentaryStatus(m, "manualPresent", "na")}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              border: manualStatusVal === "na" ? "1px solid #64748b" : "1px solid #cbd5e1",
                              backgroundColor: manualStatusVal === "na" ? "#f1f5f9" : "#fff",
                              color: manualStatusVal === "na" ? "#334155" : "#64748b",
                            }}
                          >
                            — N/A
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dettagli Aggiuntivi: Registro Manutenzioni, Scheda Tecnica, INAIL */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 10, paddingTop: 8, borderTop: "1px dashed #cbd5e1", fontSize: "12px", color: "#475569" }}>
                      <div>
                        🛠️ <strong>Registro Controlli e Manutenzioni:</strong>{" "}
                        <span style={{ fontWeight: 600, color: meta.maintenanceLogPresent === "yes" ? "#16a34a" : meta.maintenanceLogPresent === "expired" ? "#d97706" : "#dc2626" }}>
                          {meta.maintenanceLogPresent === "yes" ? "Compilato e Aggiornato" : meta.maintenanceLogPresent === "expired" ? "Non Aggiornato" : "Assente"}
                        </span>
                        {meta.lastMaintenanceDate && <span style={{ marginLeft: 6, fontSize: "11px", color: "#64748b" }}>(Ultima: {meta.lastMaintenanceDate})</span>}
                        {meta.nextMaintenanceDate && (
                          <span style={{ marginLeft: 6, fontSize: "11px", color: meta.nextMaintenanceDate < todayYmd ? "#dc2626" : "#166534", fontWeight: 600 }}>
                            (Scadenza: {meta.nextMaintenanceDate})
                          </span>
                        )}
                      </div>

                      {meta.technicalSheetDocument && (
                        <div>
                          📄 <strong>Scheda Tecnica:</strong> {meta.technicalSheetDocument.fileName}{" "}
                          <button
                            type="button"
                            onClick={() => handleOpenDocument(meta.technicalSheetDocument)}
                            style={{ border: "none", backgroundColor: "#2563eb", color: "#fff", padding: "1px 6px", borderRadius: 4, fontSize: "10px", cursor: "pointer", fontWeight: 600 }}
                          >
                            👁️ Apri
                          </button>
                        </div>
                      )}

                      {meta.inailCheckRequired && (
                        <div style={{ color: "#0369a1", fontWeight: 600 }}>
                          🔍 <strong>Verifica Periodica INAIL (art. 71 c. 11):</strong> {meta.inailSerial ? `Matr. ${meta.inailSerial}` : "Attiva"}{" "}
                          {meta.inailLastCheckDate && <span style={{ fontSize: "11px", color: "#64748b" }}>(Ultima: {meta.inailLastCheckDate}) </span>}
                          {meta.inailNextCheckDate ? (
                            <span style={{ fontSize: "11px", color: meta.inailNextCheckDate < todayYmd ? "#dc2626" : "#0369a1", fontWeight: 700 }}>
                              (Scad. {meta.inailNextCheckDate})
                            </span>
                          ) : ""}
                        </div>
                      )}
                    </div>

                    {/* Banner Sanzionabile Manutenzione Scaduta */}
                    {((meta.nextMaintenanceDate && meta.nextMaintenanceDate < todayYmd) || meta.maintenanceLogPresent === "expired") && (
                      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, backgroundColor: "#fef2f2", border: "1px solid #f87171", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>
                        🚨 NON CONFORMITÀ SANZIONABILE: Manutenzione periodica scaduta (art. 71 c. 4 lett. a / art. 71 c. 8 D.Lgs. 81/08 - arresto da 3 a 6 mesi o ammenda da 3.071,27 a 7.862,44 € ex art. 87 c. 2 lett. c)
                      </div>
                    )}

                    {/* Banner Sanzionabile Verifica INAIL Scaduta */}
                    {meta.inailCheckRequired && meta.inailNextCheckDate && meta.inailNextCheckDate < todayYmd && (
                      <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, backgroundColor: "#fef2f2", border: "1px solid #f87171", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>
                        🚨 NON CONFORMITÀ SANZIONABILE: Verifica periodica INAIL/ARPA scaduta (art. 71 c. 11 D.Lgs. 81/08 / All. VII - sanzione amm.va pecuniaria da 614,25 a 2.150,00 € ex art. 87 c. 3 lett. d)
                      </div>
                    )}
                  </div>

                  {/* BOX LAVORATORI ABILITATI ALL'USO DEL MACCHINARIO */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "16px" }}>👥</span>
                        <strong style={{ fontSize: "13px", color: "#1e293b" }}>
                          Lavoratori Abilitati all&apos;Uso della Macchina:
                        </strong>
                      </div>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {(meta.authorizedWorkerIds?.length || 0) + (meta.authorizedWorkerNames?.length || 0)} operatori autorizzati
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {((meta.authorizedWorkerIds && meta.authorizedWorkerIds.length > 0) || (meta.authorizedWorkerNames && meta.authorizedWorkerNames.length > 0)) ? (
                        <>
                          {meta.authorizedWorkerIds?.map((wId) => {
                            const emp = employees.find((e) => e.id === wId);
                            return (
                              <span
                                key={wId}
                                style={{
                                  backgroundColor: "#e0f2fe",
                                  border: "1px solid #bae6fd",
                                  color: "#0369a1",
                                  padding: "3px 10px",
                                  borderRadius: 16,
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                👤 {emp ? `${emp.firstName} ${emp.lastName}${emp.role ? ` (${emp.role})` : ""}` : `ID: ${wId}`}
                              </span>
                            );
                          })}
                          {meta.authorizedWorkerNames?.map((name, nIdx) => (
                            <span
                              key={nIdx}
                              style={{
                                backgroundColor: "#f1f5f9",
                                border: "1px solid #cbd5e1",
                                color: "#334155",
                                padding: "3px 10px",
                                borderRadius: 16,
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              👤 {name}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
                          Nessun lavoratore designato all&apos;uso. Clicca &quot;Modifica&quot; per associare gli operatori abilitati.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BOX FORMAZIONE SPECIFICA OPERATORI (COLLEGAMENTO TAB 5) */}
                  <div
                    style={{
                      backgroundColor: "#f0f9ff",
                      border: "1px solid #bae6fd",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "16px" }}>🎓</span>
                        <strong style={{ fontSize: "13px", color: "#0369a1" }}>
                          Formazione Specifica Operatori Obbligatoria:
                        </strong>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0c4a6e" }}>
                          {training.courseTitle}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#0284c7", marginTop: 2 }}>
                        ⚖️ {training.normReference} — Durata minima: <strong>{training.minHours} ore</strong> (Aggiornamento quinquennale: {training.frequencyYears} anni).
                      </div>
                    </div>

                    <span
                      style={{
                        backgroundColor: "#e0f2fe",
                        color: "#0369a1",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      🔗 Sincronizzato con Step 5 Formazione
                    </span>
                  </div>

                  {/* CASSETTO REQUISITI DI SICUREZZA SPECIFICI */}
                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                        🔍 Libreria Controlli di Sicurezza Specifici ({checks.length} requisiti):
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        {!isInspectionValidated && (
                          <button
                            type="button"
                            onClick={() => setCustomReqModalMachine(m)}
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              padding: "4px 10px",
                              borderRadius: 4,
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ➕ Aggiungi Requisito Personalizzato
                          </button>
                        )}

                        {onAddCustomItems && !isInspectionValidated && (
                          isIncludedInChecklist ? (
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>
                              ✓ Controlli inclusi nella checklist
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={integratingMachineId === m.id}
                              onClick={async () => {
                                setIntegratingMachineId(m.id);
                                try {
                                  await onAddCustomItems(
                                    checks.map((c) => ({
                                      section: "premises_equipment",
                                      domain: "safety",
                                      area: `Sicurezza Macchine - ${m.name}`,
                                      question: c.question,
                                      normReference: c.normReference,
                                      defaultSeverity: c.defaultSeverity,
                                      defaultSanctionable: c.defaultSanctionable,
                                    })),
                                  );
                                  setActionMessage(`✓ Controlli di sicurezza per "${m.name}" integrati nella checklist del sopralluogo!`);
                                } catch (e) {
                                  setError(e instanceof Error ? e.message : "Errore integrazione requisiti");
                                } finally {
                                  setIntegratingMachineId(null);
                                }
                              }}
                              style={{
                                backgroundColor: "#16a34a",
                                color: "#fff",
                                border: "none",
                                padding: "4px 12px",
                                borderRadius: 4,
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {integratingMachineId === m.id ? "Integrazione..." : "⚡ Includi nella Checklist Sopralluogo"}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {/* Gruppo 1: Requisiti Documentali Obbligatori */}
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <span>📄</span>
                          <span>Requisiti Documentali di Legge ({docChecks.length} controlli):</span>
                        </div>
                        <div style={{ display: "grid", gap: 6 }}>
                          {docChecks.map((chk, cidx) => (
                            <div
                              key={`doc_${chk.code || cidx}`}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                                padding: "6px 10px",
                                backgroundColor: "#f0f9ff",
                                borderRadius: 6,
                                border: "1px solid #bae6fd",
                                fontSize: "12px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <strong style={{ color: "#0369a1" }}>{chk.title}:</strong> {chk.question}
                              </div>
                              <span style={{ color: "#0284c7", fontStyle: "italic", whiteSpace: "nowrap", fontSize: "11px", fontWeight: 600 }}>
                                {chk.normReference}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gruppo 2: Requisiti Operativi Specifici di Sicurezza */}
                      {specChecks.length > 0 && (
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                            <span>🛡️</span>
                            <span>Requisiti Operativi Specifici di Sicurezza ({specChecks.length} controlli):</span>
                          </div>
                          <div style={{ display: "grid", gap: 6 }}>
                            {specChecks.map((chk, cidx) => (
                              <div
                                key={`spec_${chk.code || cidx}`}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 12,
                                  padding: "6px 10px",
                                  backgroundColor: "#f8fafc",
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: "12px",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <strong>{chk.title}:</strong> {chk.question}
                                </div>
                                <span style={{ color: "#64748b", fontStyle: "italic", whiteSpace: "nowrap", fontSize: "11px" }}>
                                  {chk.normReference}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {machines.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  border: "2px dashed #cbd5e1",
                  color: "#64748b",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: 10 }}>🚜</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  Nessuna macchina censita per questa azienda
                </div>
                <div style={{ fontSize: "13px", marginTop: 6, marginBottom: 16 }}>
                  Precarica le macchine standard previste per il settore {sectorCatalog.sectorLabel} o inseriscile manualmente.
                </div>
                {!isInspectionValidated && (
                  <button
                    type="button"
                    onClick={handlePreloadSectorMachines}
                    style={{
                      backgroundColor: "var(--color-primary, #0f172a)",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 6,
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ Precarica {sectorCatalog.machines.length} Macchine Tipiche del Settore
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCHEDA 2: ATTREZZATURE MINORI                                 */}
      {/* ============================================================== */}
      {tab === "equipment" && (
        <EquipmentTab
          token={token}
          companyId={companyId}
          items={equipment}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* SCHEDA 3: ESTINTORI                                            */}
      {/* ============================================================== */}
      {tab === "extinguishers" && (
        <ExtinguishersTab
          token={token}
          companyId={companyId}
          items={extinguishers}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* SCHEDA 4: CASSETTE PRIMO SOCCORSO                              */}
      {/* ============================================================== */}
      {tab === "firstAid" && (
        <FirstAidTab
          token={token}
          companyId={companyId}
          items={firstAidKits}
          onChanged={reload}
          onError={setError}
          onOpenQr={onOpenQr}
        />
      )}

      {/* ============================================================== */}
      {/* MODALE INSERIMENTO / MODIFICA MACCHINA CON DATI MINIMI         */}
      {/* ============================================================== */}
      {showMachineModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
                {editingMachine ? `✏️ Modifica Macchina: ${editingMachine.name}` : "➕ Nuovo Censimento Macchina / Attrezzatura"}
              </h3>
              <button
                type="button"
                onClick={() => setShowMachineModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMachine} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Dati Minimi: Nome e Tipo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Nome Macchinario *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Affettatrice professionale, Carrello elevatore"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Categoria / Tipo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Es. Macchina Lavorazione Carni, Sollevamento"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Dati Minimi: Costruttore, Modello, Matricola */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Costruttore / Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Berkel, Toyota"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Modello
                  </label>
                  <input
                    type="text"
                    placeholder="Es. V350, Traigo 48"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Numero Matricola
                  </label>
                  <input
                    type="text"
                    placeholder="Es. SN-948201"
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Anno Fabbricazione e Data Installazione */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Anno di Fabbricazione
                  </label>
                  <input
                    type="number"
                    min={1960}
                    max={new Date().getFullYear() + 1}
                    value={formBuildYear ?? ""}
                    onChange={(e) => setFormBuildYear(e.target.value ? Number(e.target.value) : undefined)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Data di Installazione in Azienda
                  </label>
                  <input
                    type="date"
                    value={formInstallationDate}
                    onChange={(e) => setFormInstallationDate(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* REQUISITI DOCUMENTALI OBBLIGATORI (D.Lgs. 81/08 Titolo III) */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: "15px" }}>📄</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    Requisiti Documentali Obbligatori (D.Lgs. 81/08 Titolo III)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {/* 1. Certificazione CE */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                        1. Certificazione / Dichiarazione CE
                      </label>
                      <span style={{ fontSize: "10px", color: "#166534", backgroundColor: "#dcfce7", padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>
                        🛡️ Permanente
                      </span>
                    </div>
                    <select
                      value={formCeCertificationPresent}
                      onChange={(e) => {
                        const val = e.target.value as "yes" | "no" | "na";
                        setFormCeCertificationPresent(val);
                        if (val === "no") setFormCeStatus("non_compliant");
                        else if (val === "yes" && formCeStatus === "non_compliant") setFormCeStatus("ce_compliant");
                      }}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="yes">✅ Sì (Conforme / Presente)</option>
                      <option value="no">❌ No (Assente / Carente)</option>
                      <option value="na">⚪ Non Applicabile</option>
                    </select>
                    <div style={{ marginTop: 4, fontSize: "11px", color: "#64748b" }}>
                      Data emissione/rilascio (senza scadenza):
                      <input
                        type="date"
                        value={formCeReleaseDate}
                        onChange={(e) => setFormCeReleaseDate(e.target.value)}
                        style={{ marginTop: 2, width: "100%", padding: "4px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {/* Stato Tecnico Marcatura */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Stato Marcatura (Direttiva Macchine)
                    </label>
                    <select
                      value={formCeStatus}
                      onChange={(e) => setFormCeStatus(e.target.value as any)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="ce_compliant">Marcata CE (Direttiva Macchine)</option>
                      <option value="ante_ce_annex_v">Ante-CE (Adeguata ad All. V D.Lgs. 81/08)</option>
                      <option value="non_compliant">Non Conforme / Manca Marcatura</option>
                    </select>
                  </div>

                  {/* 2. Installazione a Regola d'Arte */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                        2. Installazione a Regola d&apos;Arte (art. 71 c. 3)
                      </label>
                      <span style={{ fontSize: "10px", color: "#166534", backgroundColor: "#dcfce7", padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>
                        🛡️ Permanente
                      </span>
                    </div>
                    <select
                      value={formInstallationCompliant}
                      onChange={(e) => setFormInstallationCompliant(e.target.value as "yes" | "no" | "na")}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="yes">✅ Sì (Installata a regola d&apos;arte)</option>
                      <option value="no">❌ No (Non a regola d&apos;arte / Difetti)</option>
                      <option value="na">⚪ Non Applicabile</option>
                    </select>
                    <div style={{ marginTop: 4, fontSize: "11px", color: "#64748b" }}>
                      Data dichiarazione/certificazione (senza scadenza):
                      <input
                        type="date"
                        value={formInstallationCertifiedDate}
                        onChange={(e) => setFormInstallationCertifiedDate(e.target.value)}
                        style={{ marginTop: 2, width: "100%", padding: "4px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {/* 3. Valutazione Rischi Inserita nel DVR */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      3. Valutazione Rischi Inserita nel DVR (art. 28)
                    </label>
                    <select
                      value={formRiskAssessmentInDvr}
                      onChange={(e) => setFormRiskAssessmentInDvr(e.target.value as "yes" | "no" | "na")}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="yes">✅ Sì (Valutata e presente nel DVR)</option>
                      <option value="no">❌ No (Non inserita / Non valutata)</option>
                      <option value="na">⚪ Non Applicabile</option>
                    </select>
                  </div>

                  {/* 4. Libretto Uso e Manutenzione */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                        4. Libretto d&apos;Uso e Manutenzione (in Italiano)
                      </label>
                      <span style={{ fontSize: "10px", color: "#166534", backgroundColor: "#dcfce7", padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>
                        🛡️ Permanente
                      </span>
                    </div>
                    <select
                      value={formManualPresent}
                      onChange={(e) => setFormManualPresent(e.target.value as "yes" | "no" | "na")}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="yes">✅ Sì (Disponibile in lingua italiana)</option>
                      <option value="no">❌ No (Assente / Non reperibile)</option>
                      <option value="na">⚪ Non Applicabile</option>
                    </select>
                    <div style={{ marginTop: 4, fontSize: "11px", color: "#64748b" }}>
                      Data edizione manuale (senza scadenza):
                      <input
                        type="date"
                        value={formManualReleaseDate}
                        onChange={(e) => setFormManualReleaseDate(e.target.value)}
                        style={{ marginTop: 2, width: "100%", padding: "4px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {/* Registro Manutenzioni */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                      Registro Controlli e Manutenzioni
                    </label>
                    <select
                      value={formMaintenanceLogPresent}
                      onChange={(e) => setFormMaintenanceLogPresent(e.target.value as any)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                    >
                      <option value="yes">✅ Compilato e aggiornato</option>
                      <option value="expired">⚠️ Non aggiornato</option>
                      <option value="no">❌ Assente</option>
                    </select>
                  </div>
                </div>

                {/* Dettagli Manutenzione Programmata (Periodicità 12/24 mesi) */}
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed #cbd5e1" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    🛠️ Manutenzione Programmata e Periodica (D.Lgs. 81/08 art. 71 c. 4 e c. 8)
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                        Data Ultima Manutenzione
                      </label>
                      <input
                        type="date"
                        value={formLastMaintenanceDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormLastMaintenanceDate(val);
                          if (val) {
                            setFormNextMaintenanceDate(addMonthsToYmd(val, formMaintenancePeriodicityMonths));
                          }
                        }}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                        Periodicità Manutenzione
                      </label>
                      <select
                        value={formMaintenancePeriodicityMonths}
                        onChange={(e) => {
                          const months = Number(e.target.value);
                          setFormMaintenancePeriodicityMonths(months);
                          if (formLastMaintenanceDate) {
                            setFormNextMaintenanceDate(addMonthsToYmd(formLastMaintenanceDate, months));
                          }
                        }}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      >
                        <option value={12}>12 Mesi (Annuale - Standard)</option>
                        <option value={24}>24 Mesi (Biennale)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                        Prossima Manutenzione (Scadenza)
                      </label>
                      <input
                        type="date"
                        value={formNextMaintenanceDate}
                        onChange={(e) => setFormNextMaintenanceDate(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                  {formNextMaintenanceDate && formNextMaintenanceDate < todayYmd && (
                    <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", fontSize: "12px", fontWeight: 600 }}>
                      🚨 NON CONFORMITÀ SANZIONABILE: Manutenzione periodica scaduta (art. 71 c. 4 lett. a / art. 71 c. 8 D.Lgs. 81/08 - arresto da 3 a 6 mesi o ammenda da 3.071,27 a 7.862,44 € ex art. 87 c. 2 lett. c)
                    </div>
                  )}
                </div>
              </div>

              {/* Verifica Periodica Obbligatoria ex art. 71 c. 11 (INAIL / ARPA) */}
              <div
                style={{
                  backgroundColor: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: 8,
                  padding: "12px",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "13px", fontWeight: 700, color: "#0369a1", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formInailCheckRequired}
                    onChange={(e) => setFormInailCheckRequired(e.target.checked)}
                  />
                  <span>Attrezzatura soggetta a Verifica Periodica Obbligatoria (D.Lgs. 81/08 art. 71 c. 11 / D.M. 11/04/2011)</span>
                </label>

                {formInailCheckRequired && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                          Matricola INAIL / Codice Impianto
                        </label>
                        <input
                          type="text"
                          placeholder="Es. INAIL-49821"
                          value={formInailSerial}
                          onChange={(e) => setFormInailSerial(e.target.value)}
                          style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                          Periodicità Verifica
                        </label>
                        <select
                          value={formInailPeriodicityMonths}
                          onChange={(e) => {
                            const months = Number(e.target.value);
                            setFormInailPeriodicityMonths(months);
                            if (formInailLastCheckDate) {
                              setFormInailNextCheckDate(addMonthsToYmd(formInailLastCheckDate, months));
                            }
                          }}
                          style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                        >
                          <option value={12}>12 Mesi (All. VII - Sollevamento vetusti / pressione)</option>
                          <option value={24}>24 Mesi (All. VII - Sollevamento ordinario)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                          Data Ultima Verifica
                        </label>
                        <input
                          type="date"
                          value={formInailLastCheckDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormInailLastCheckDate(val);
                            if (val) {
                              setFormInailNextCheckDate(addMonthsToYmd(val, formInailPeriodicityMonths));
                            }
                          }}
                          style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#0c4a6e", marginBottom: 4 }}>
                          Prossima Verifica / Scadenza *
                        </label>
                        <input
                          type="date"
                          value={formInailNextCheckDate}
                          onChange={(e) => setFormInailNextCheckDate(e.target.value)}
                          style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #93c5fd", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    {formInailNextCheckDate && formInailNextCheckDate < todayYmd && (
                      <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", fontSize: "12px", fontWeight: 600 }}>
                        🚨 NON CONFORMITÀ SANZIONABILE: Verifica periodica INAIL/ARPA scaduta (art. 71 c. 11 D.Lgs. 81/08 / All. VII - sanzione amm.va pecuniaria da 614,25 a 2.150,00 € ex art. 87 c. 3 lett. d)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Locale Censito (Step 2) e Ubicazione specifica */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Locale di Riferimento (dagli Ambienti Step 2)
                  </label>
                  <select
                    value={formEnvironmentName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormEnvironmentName(val);
                      if (val && !formLocation) setFormLocation(val);
                    }}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  >
                    <option value="">-- Seleziona locale dagli ambienti registrati --</option>
                    {environments.map((env) => (
                      <option key={env.id} value={env.name}>
                        📍 {env.name} {env.surfaceMq ? `(${env.surfaceMq} mq)` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                    Reparto / Ubicazione Specifica
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Corsia 3, Banco carni, Linea taglio"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                  />
                </div>
              </div>

              {/* Documenti Scansionati (PDF o Immagini fino a 5MB) */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: "15px" }}>📁</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                    Documentazione Tecnica Digitale (Libretti, Schede, Conformità CE)
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>(Max 5MB per file - PDF, PNG, JPG)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {/* Libretto d'Uso */}
                  <div style={{ border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: 6, padding: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      📖 Libretto Uso e Manutenzione
                    </div>
                    {formManualDoc ? (
                      <div>
                        <div style={{ fontSize: "11px", color: "#0f172a", fontWeight: 600, wordBreak: "break-all", marginBottom: 4 }}>
                          ✓ {formManualDoc.fileName}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: 6 }}>
                          {(formManualDoc.fileSize / 1024).toFixed(1)} KB
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDocument(formManualDoc)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #94a3b8", backgroundColor: "#f1f5f9", cursor: "pointer" }}
                          >
                            👁️ Apri
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormManualDoc(undefined)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #fca5a5", backgroundColor: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "manual")}
                          style={{ fontSize: "11px", width: "100%" }}
                        />
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: 4 }}>Nessun libretto allegato</div>
                      </div>
                    )}
                  </div>

                  {/* Scheda Tecnica */}
                  <div style={{ border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: 6, padding: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      📋 Scheda Tecnica Costruttore
                    </div>
                    {formTechSheetDoc ? (
                      <div>
                        <div style={{ fontSize: "11px", color: "#0f172a", fontWeight: 600, wordBreak: "break-all", marginBottom: 4 }}>
                          ✓ {formTechSheetDoc.fileName}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: 6 }}>
                          {(formTechSheetDoc.fileSize / 1024).toFixed(1)} KB
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDocument(formTechSheetDoc)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #94a3b8", backgroundColor: "#f1f5f9", cursor: "pointer" }}
                          >
                            👁️ Apri
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormTechSheetDoc(undefined)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #fca5a5", backgroundColor: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "techSheet")}
                          style={{ fontSize: "11px", width: "100%" }}
                        />
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: 4 }}>Nessuna scheda tecnica</div>
                      </div>
                    )}
                  </div>

                  {/* Dichiarazione CE */}
                  <div style={{ border: "1px solid #e2e8f0", backgroundColor: "#fff", borderRadius: 6, padding: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      🏷️ Dichiarazione CE / All. V
                    </div>
                    {formCeDeclDoc ? (
                      <div>
                        <div style={{ fontSize: "11px", color: "#0f172a", fontWeight: 600, wordBreak: "break-all", marginBottom: 4 }}>
                          ✓ {formCeDeclDoc.fileName}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b", marginBottom: 6 }}>
                          {(formCeDeclDoc.fileSize / 1024).toFixed(1)} KB
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDocument(formCeDeclDoc)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #94a3b8", backgroundColor: "#f1f5f9", cursor: "pointer" }}
                          >
                            👁️ Apri
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormCeDeclDoc(undefined)}
                            style={{ padding: "3px 8px", fontSize: "11px", borderRadius: 4, border: "1px solid #fca5a5", backgroundColor: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
                          >
                            🗑️ Rimuovi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleFileUpload(e, "ceDecl")}
                          style={{ fontSize: "11px", width: "100%" }}
                        />
                        <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: 4 }}>Nessuna conformità CE</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lavoratori Abilitati all'Uso della Macchina */}
              <div
                style={{
                  backgroundColor: "#fdf8f6",
                  border: "1px solid #fed7aa",
                  borderRadius: 8,
                  padding: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "16px" }}>👥</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#9a3412" }}>
                      Lavoratori Abilitati e Addetti all'Uso
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#c2410c" }}>
                    Sincronizzato con lo Step 5 Formazione per il controllo di abilitazioni e patentini
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "#431407", marginBottom: 10 }}>
                  Seleziona i dipendenti aziendali autorizzati all'uso di questa specifica attrezzatura:
                </div>

                {employees.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#78716c", fontStyle: "italic", padding: "8px", backgroundColor: "#fff", borderRadius: 6, border: "1px dashed #cbd5e1" }}>
                    Nessun dipendente attivo registrato per questa azienda. Inserisci eventuali nominativi esterni nel campo sottostante.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: "150px", overflowY: "auto", padding: "4px" }}>
                    {employees.map((emp) => {
                      const isSelected = formAuthorizedWorkerIds.includes(emp.id);
                      return (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormAuthorizedWorkerIds((prev) => prev.filter((id) => id !== emp.id));
                            } else {
                              setFormAuthorizedWorkerIds((prev) => [...prev, emp.id]);
                            }
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 10px",
                            borderRadius: 16,
                            border: isSelected ? "1px solid #ea580c" : "1px solid #cbd5e1",
                            backgroundColor: isSelected ? "#ffedd5" : "#fff",
                            color: isSelected ? "#9a3412" : "#334155",
                            fontSize: "12px",
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span>{isSelected ? "✓" : "+"}</span>
                          <span>{emp.firstName} {emp.lastName}</span>
                          {emp.jobTitle && <span style={{ fontSize: "10px", opacity: 0.8 }}>({emp.jobTitle})</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: 4 }}>
                    Altri Operatori Abilitati / Lavoratori Esterni o Autonomi (separati da virgola)
                  </label>
                  <input
                    type="text"
                    placeholder="Es. Mario Rossi (esterno), Luca Bianchi (socio)"
                    value={formAuthorizedCustomWorkers}
                    onChange={(e) => setFormAuthorizedCustomWorkers(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #fdba74", fontSize: "12px", backgroundColor: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowMachineModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    color: "#334155",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "var(--color-primary, #0f172a)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {formSubmitting ? "Salvataggio..." : "Salva Macchinario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE AGGIUNGI REQUISITO PERSONALIZZATO SULLA MACCHINA */}
      {customReqModalMachine && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a" }}>
                ➕ Aggiungi Requisito di Sicurezza: {customReqModalMachine.name}
              </h3>
              <button
                type="button"
                onClick={() => setCustomReqModalMachine(null)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomRequirementToMachine} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Domanda / Verifica di Conformità Specificata *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Es. Il carter della catena di trasmissione presenta microinterruttore di sicurezza efficiente?"
                  value={customReqQuestion}
                  onChange={(e) => setCustomReqQuestion(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  Riferimento Normativo (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es. D.Lgs. 81/2008 Allegato V punto 6"
                  value={customReqNorm}
                  onChange={(e) => setCustomReqNorm(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>Gravità:</span>
                  <select
                    value={customReqSeverity}
                    onChange={(e) => setCustomReqSeverity(Number(e.target.value))}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "12px" }}
                  >
                    <option value={1}>1 - Lieve</option>
                    <option value={2}>2 - Media</option>
                    <option value={3}>3 - Grave</option>
                    <option value={4}>4 - Critica</option>
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={customReqSanctionable}
                    onChange={(e) => setCustomReqSanctionable(e.target.checked)}
                  />
                  <span>Sanzionabile se carente</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setCustomReqModalMachine(null)}
                  style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px" }}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  style={{ padding: "7px 16px", borderRadius: 6, border: "none", backgroundColor: "var(--color-primary, #0f172a)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                >
                  Aggiungi Requisito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
