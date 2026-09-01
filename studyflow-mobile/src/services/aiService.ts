import { apiRequest } from "./api";

export async function sendAIMessage(
  userMessage: string
): Promise<string> {
  if (!userMessage.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const response = await apiRequest("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({
      message: userMessage.trim(),
    }),
  });

  return response as string;
}