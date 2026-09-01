import { apiRequest } from "./api";

export interface FriendUser {
  id: number;
  name: string;
  email: string;
  profileImage?: string | null;
}

export interface FriendRequest {
  friendshipId: number;
  user: FriendUser;
}

export async function getFriends(): Promise<FriendUser[]> {
  return await apiRequest("/api/friends");
}

export async function searchUsers(query: string): Promise<FriendUser[]> {
  return await apiRequest(`/api/friends/search?q=${encodeURIComponent(query)}`);
}

export async function sendFriendRequest(userId: number) {
  return await apiRequest(`/api/friends/request/${userId}`, { method: "POST" });
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
  return await apiRequest("/api/friends/requests");
}

export async function acceptFriendRequest(friendshipId: number) {
  return await apiRequest(`/api/friends/requests/${friendshipId}/accept`, { method: "POST" });
}

export async function declineFriendRequest(friendshipId: number) {
  return await apiRequest(`/api/friends/requests/${friendshipId}/decline`, { method: "POST" });
}
