import { apiRequest } from "./api";

export interface StudySession {
  id: number;
  title?: string;
  subjectId?: number;
  subjectName?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  status?: string;
}

export interface CreateStudySessionRequest {
  title?: string;
  subjectId?: number;
  startTime?: string;
  endTime?: string;
  duration?: number;
  notes?: string;
}

export async function getStudySessions(): Promise<
  StudySession[]
> {
  return apiRequest("/api/study-sessions");
}

export async function getStudySessionById(
  sessionId: number
): Promise<StudySession> {
  return apiRequest(`/api/study-sessions/${sessionId}`);
}

export async function createStudySession(
  session: CreateStudySessionRequest
): Promise<StudySession> {
  return apiRequest("/api/study-sessions", {
    method: "POST",
    body: JSON.stringify(session),
  });
}

export async function updateStudySession(
  sessionId: number,
  session: Partial<CreateStudySessionRequest>
): Promise<StudySession> {
  return apiRequest(`/api/study-sessions/${sessionId}`, {
    method: "PUT",
    body: JSON.stringify(session),
  });
}

export async function deleteStudySession(
  sessionId: number
): Promise<void> {
  await apiRequest(`/api/study-sessions/${sessionId}`, {
    method: "DELETE",
  });
}