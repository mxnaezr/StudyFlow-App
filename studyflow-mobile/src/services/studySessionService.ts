import { apiRequest } from "./api";

export interface StudySession {
  id: number;
  title?: string;
  subjectId?: number;
  subjectName?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  durationMinutes?: number;
  notes?: string;
  status?: string;
}

export interface CreateStudySessionRequest {
  userId: number;
  subjectId: number;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  notes?: string;
}

function mapSession(session: any): StudySession {
  return {
    id: session.id,
    subjectId: session.subjectId ?? session.subject?.id,
    subjectName: session.subjectName ?? session.subject?.name,
    startTime: session.startTime,
    endTime: session.endTime,
    duration: session.duration ?? session.durationMinutes ?? 0,
    durationMinutes: session.durationMinutes ?? session.duration ?? 0,
    notes: session.notes,
    status: session.status,
    title: session.title,
  };
}

export async function getStudySessions(userId: number): Promise<StudySession[]> {
  const data = await apiRequest(`/api/study-sessions/user/${userId}`);
  return Array.isArray(data) ? data.map(mapSession) : [];
}

export async function getStudySessionById(sessionId: number): Promise<StudySession> {
  const data = await apiRequest(`/api/study-sessions/${sessionId}`);
  return mapSession(data);
}

export async function getStudySessionsBySubject(subjectId: number): Promise<StudySession[]> {
  const data = await apiRequest(`/api/study-sessions/subject/${subjectId}`);
  return Array.isArray(data) ? data.map(mapSession) : [];
}

export async function createStudySession(
  session: CreateStudySessionRequest
): Promise<StudySession> {
  const data = await apiRequest(
    `/api/study-sessions/user/${session.userId}/subject/${session.subjectId}`,
    {
      method: "POST",
      body: JSON.stringify({
        startTime: session.startTime,
        endTime: session.endTime,
        durationMinutes: session.durationMinutes ?? 0,
        notes: session.notes,
      }),
    }
  );

  return mapSession(data);
}

export async function updateStudySession(
  sessionId: number,
  session: Partial<Omit<CreateStudySessionRequest, "userId" | "subjectId">>
): Promise<StudySession> {
  const data = await apiRequest(`/api/study-sessions/${sessionId}`, {
    method: "PUT",
    body: JSON.stringify({
      startTime: session.startTime,
      endTime: session.endTime,
      durationMinutes: session.durationMinutes ?? 0,
      notes: session.notes,
    }),
  });

  return mapSession(data);
}

export async function deleteStudySession(sessionId: number): Promise<void> {
  await apiRequest(`/api/study-sessions/${sessionId}`, {
    method: "DELETE",
  });
}
