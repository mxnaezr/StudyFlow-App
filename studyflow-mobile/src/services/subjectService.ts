import { apiRequest } from "./api";

export interface Subject {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export async function getSubjects(): Promise<Subject[]> {
  return apiRequest("/api/subjects");
}

export async function getSubjectById(
  subjectId: number
): Promise<Subject> {
  return apiRequest(`/api/subjects/${subjectId}`);
}

export async function createSubject(
  subject: Omit<Subject, "id">
): Promise<Subject> {
  return apiRequest("/api/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
  });
}

export async function updateSubject(
  subjectId: number,
  subject: Partial<Subject>
): Promise<Subject> {
  return apiRequest(`/api/subjects/${subjectId}`, {
    method: "PUT",
    body: JSON.stringify(subject),
  });
}

export async function deleteSubject(
  subjectId: number
): Promise<void> {
  await apiRequest(`/api/subjects/${subjectId}`, {
    method: "DELETE",
  });
}