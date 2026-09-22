import { apiRequest } from "./api";

export interface StudyCallToken {
  logId: number;
  serverUrl: string;
  roomName: string;
  participantToken: string;
}

export interface StudyCallLog {
  id: number;
  roomCode: string;
  joinedAt: string;
  leftAt?: string;
  durationSeconds?: number;
  callType: string;
}

export async function startStudyCall(roomCode: string): Promise<StudyCallToken> {
  return apiRequest("/api/study-calls/start", {
    method: "POST",
    body: JSON.stringify({ roomCode }),
  });
}

export async function endStudyCall(logId: number): Promise<void> {
  await apiRequest(`/api/study-calls/${logId}/end`, { method: "POST" });
}

export async function getStudyCallHistory(): Promise<StudyCallLog[]> {
  const data = await apiRequest("/api/study-calls/history");
  return Array.isArray(data) ? data : [];
}
