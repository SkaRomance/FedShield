// Step 1 "Documenti" extracted from ChecklistPage.tsx during S13-A refactor.
// Pure JSX extraction: nessun cambio di logica rispetto al monolite originale.

import { Dispatch, SetStateAction } from "react";
import { InspectionDocumentRequirement } from "../../api";
import { DOCUMENT_STATUS_OPTIONS } from "./_shared";

interface Step1DocumentiProps {
  documents: InspectionDocumentRequirement[];
  setDocuments: Dispatch<SetStateAction<InspectionDocumentRequirement[]>>;
  isInspectionValidated: boolean;
}

export default function Step1Documenti({
  documents,
  setDocuments,
  isInspectionValidated,
}: Step1DocumentiProps) {
  return (
    <div className="panel section-panel">
      <h3>Documenti visionati e richiesti in differita</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Obbl.</th>
              <th>Stato</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={`${doc.name}-${idx}`}>
                <td>{doc.name}</td>
                <td>{doc.isRequired ? "SI" : "NO"}</td>
                <td>
                  <select
                    value={doc.status}
                    disabled={isInspectionValidated}
                    onChange={(event) => {
                      const nextStatus = event.target.value as InspectionDocumentRequirement["status"];
                      setDocuments((current) =>
                        current.map((item, itemIdx) =>
                          itemIdx === idx
                            ? {
                                ...item,
                                status: nextStatus,
                              }
                            : item,
                        ),
                      );
                    }}
                  >
                    {DOCUMENT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    value={doc.note ?? ""}
                    disabled={isInspectionValidated}
                    onChange={(event) =>
                      setDocuments((current) =>
                        current.map((item, itemIdx) =>
                          itemIdx === idx
                            ? {
                                ...item,
                                note: event.target.value,
                              }
                            : item,
                        ),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={4}>Seleziona un sopralluogo per caricare la checklist documentale.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
