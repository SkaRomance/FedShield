// Step 3 "Procedure e Igiene" extracted from ChecklistPage.tsx during S13-A refactor.
// Pure JSX extraction: nessun cambio di logica rispetto al monolite originale.

import { ChecklistItem } from "../../api";

interface Step3ProcedureIgieneProps {
  procedureItems: ChecklistItem[];
  renderAnswersTable: (items: ChecklistItem[]) => React.ReactNode;
}

export default function Step3ProcedureIgiene({
  procedureItems,
  renderAnswersTable,
}: Step3ProcedureIgieneProps) {
  return (
    <div className="panel section-panel">
      <h3>Procedure di lavoro e requisiti igienici</h3>
      {renderAnswersTable(procedureItems)}
    </div>
  );
}
