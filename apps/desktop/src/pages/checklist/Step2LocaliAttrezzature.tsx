// Step 2 "Locali e Attrezzature" extracted from ChecklistPage.tsx during S13-A refactor.
// Pure JSX extraction: nessun cambio di logica rispetto al monolite originale.

import { ChecklistItem } from "../../api";

interface Step2LocaliAttrezzatureProps {
  premisesItems: ChecklistItem[];
  renderAnswersTable: (items: ChecklistItem[]) => React.ReactNode;
}

export default function Step2LocaliAttrezzature({
  premisesItems,
  renderAnswersTable,
}: Step2LocaliAttrezzatureProps) {
  return (
    <div className="panel section-panel">
      <h3>Requisiti locali e attrezzature</h3>
      {renderAnswersTable(premisesItems)}
    </div>
  );
}
