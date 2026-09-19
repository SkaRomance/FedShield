// Requisiti specifici di sicurezza per macchine e attrezzature (D.Lgs. 81/2008 Titolo III / Direttiva Macchine)
// Generatore automatico di controlli di conformità in base alle macchine registrate.

export interface MachineRequirementDefinition {
  code: string;
  title: string;
  question: string;
  normReference: string;
  defaultSeverity: number;
  defaultSanctionable: boolean;
  domain: "safety";
  area: string;
}

export function getMachineSpecificRequirements(
  machineName: string,
  model?: string | null,
): MachineRequirementDefinition[] {
  const name = (machineName || "Macchina").trim();
  const label = model && model.trim() ? `${name} (Mod. ${model.trim()})` : name;
  const areaName = `Sicurezza Macchine - ${name}`;

  return [
    {
      code: "CE_CONFORMITY",
      title: "Marcatura CE e Dichiarazione di Conformità",
      question: `La macchina ${label} presenta marcatura CE visibile e leggibile, con targhetta identificativa del costruttore e dichiarazione di conformità CE/UE disponibile in azienda?`,
      normReference: "D.Lgs. 81/2008, art. 70 c. 1; D.Lgs. 17/2010",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
    {
      code: "USER_MANUAL",
      title: "Libretto d'Uso e Manutenzione in Lingua Italiana",
      question: `È presente in azienda e prontamente consultabile dagli operatori il manuale d'uso e manutenzione di ${label} redatto in lingua italiana?`,
      normReference: "D.Lgs. 81/2008, art. 70 c. 2 e art. 73 c. 1",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
    {
      code: "GUARDS_AND_INTERLOCKS",
      title: "Ripari e Dispositivi di Sicurezza Organi in Movimento",
      question: `Tutti gli organi mobili e le zone di pericolo di ${label} sono dotati di ripari fissi o mobili, carter e microinterruttori di interblocco di sicurezza efficienti contro il rischio di contatto o trascinamento?`,
      normReference: "D.Lgs. 81/2008, All. V, parte I, p. 6 e All. VI",
      defaultSeverity: 4,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
    {
      code: "EMERGENCY_STOP",
      title: "Dispositivo di Arresto di Emergenza",
      question: `La macchina ${label} è provvista di dispositivo di arresto di emergenza ad azione rapida (fungo d'emergenza), chiaramente individuabile, accessibile e funzionante?`,
      normReference: "D.Lgs. 81/2008, All. V, parte I, p. 2",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
    {
      code: "MAINTENANCE_LOG",
      title: "Registro Manutenzioni e Controlli Periodici",
      question: `Gli interventi di manutenzione programmata, la pulizia e le verifiche periodiche di sicurezza su ${label} sono puntualmente eseguiti e registrati sull'apposito registro?`,
      normReference: "D.Lgs. 81/2008, art. 71 c. 4 e c. 8",
      defaultSeverity: 2,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
    {
      code: "OPERATOR_TRAINING",
      title: "Formazione e Addestramento Specifico Operatori",
      question: `I lavoratori incaricati dell'uso di ${label} hanno ricevuto documentata informazione, formazione e adeguato addestramento pratico all'uso in sicurezza dell'attrezzatura?`,
      normReference: "D.Lgs. 81/2008, art. 73 c. 4",
      defaultSeverity: 3,
      defaultSanctionable: true,
      domain: "safety",
      area: areaName,
    },
  ];
}
