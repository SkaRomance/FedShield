# Prompt operativo Sprint 2 (Codex)

Usa questo prompt per continuare lo sviluppo partendo dallo stato attuale del repository.

```text
Repository: FedShield
Obiettivo sprint: implementare checklist dinamiche + primo verbale PDF.

Task obbligatori:
1) Aggiungi entita Prisma:
   - ChecklistTemplate, ChecklistItem, InspectionAnswer
2) Crea API:
   - GET /api/checklists/templates
   - GET /api/checklists/templates/:id/items
   - POST /api/inspections/:id/answers
3) Regole:
   - quando answer = NO, crea/aggiorna automaticamente NonConformity collegata
   - se inspection status = validated, blocca modifica risposte
4) Crea servizio `apps/backend/src/services/report.service.ts` per generare JSON di verbale (fase pre-PDF)
5) Aggiorna app desktop:
   - pagina compilazione checklist
   - salvataggio risposte in tempo reale
6) Aggiungi test backend minimi sui nuovi endpoint.

Vincoli:
- Non rompere endpoint esistenti.
- Mantieni TypeScript strict.
- Aggiorna README con i nuovi comandi.
```
