import { Employee } from "../../api";

interface ScadenzeTabProps {
  employees: Employee[];
}

export default function ScadenzeTab({ employees }: ScadenzeTabProps) {
  function getStatusColor(expiresAt: string | null): string {
    if (!expiresAt) return "gray";
    const days = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return "crimson";
    if (days <= 30) return "orange";
    if (days <= 90) return "#caa800";
    return "green";
  }

  function getStatusText(expiresAt: string | null): string {
    if (!expiresAt) return "—";
    const days = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return `SCADUTO da ${Math.abs(days)}gg`;
    if (days <= 30) return `Scade tra ${days}gg`;
    if (days <= 90) return `${days}gg residui`;
    return "Valido";
  }

  return (
    <section className="panel">
      <h3>Scadenze formazione dipendenti</h3>
      <table>
        <thead>
          <tr>
            <th>Dipendente</th>
            <th>Ruolo</th>
            <th>Corso</th>
            <th>Ore</th>
            <th>Frequenza</th>
            <th>Scadenza</th>
            <th>Stato</th>
            <th>Attestato</th>
          </tr>
        </thead>
        <tbody>
          {employees.flatMap((emp) => {
            const records = emp.trainingRecords ?? [];
            if (records.length === 0) {
              return (
                <tr key={emp.id}>
                  <td>
                    {emp.lastName} {emp.firstName}
                  </td>
                  <td>{emp.role || "—"}</td>
                  <td colSpan={6} style={{ color: "gray" }}>
                    Nessun corso registrato
                  </td>
                </tr>
              );
            }
            return records.map((rec, idx) => (
              <tr key={`${emp.id}-${rec.id}`}>
                {idx === 0 ? (
                  <td rowSpan={records.length}>
                    <strong>
                      {emp.lastName} {emp.firstName}
                    </strong>
                    {emp.fiscalCode ? (
                      <>
                        <br />
                        <small>{emp.fiscalCode}</small>
                      </>
                    ) : null}
                  </td>
                ) : null}
                {idx === 0 ? (
                  <td rowSpan={records.length}>{emp.role || "—"}</td>
                ) : null}
                <td>{rec.course.name}</td>
                <td>
                  {rec.hoursDone || rec.course.minHours}h / {rec.course.minHours}h
                </td>
                <td>{rec.course.frequencyYears} anni</td>
                <td>
                  {rec.expiresAt
                    ? new Date(rec.expiresAt).toLocaleDateString("it-IT")
                    : "—"}
                </td>
                <td style={{ color: getStatusColor(rec.expiresAt) }}>
                  {getStatusText(rec.expiresAt)}
                </td>
                <td>{rec.certificateNumber || "—"}</td>
              </tr>
            ));
          })}
          {employees.length === 0 ? (
            <tr>
              <td colSpan={8}>Nessun dipendente attivo.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
