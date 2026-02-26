export type UserRole = "junior" | "senior" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export type InspectionState = "draft" | "pending_validation" | "validated";

export interface ComplianceScore {
  score: number;
  stars: 1 | 2 | 3 | 4 | 5;
  hasSanctionableNc: boolean;
}
