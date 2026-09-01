import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  searchUsers,
  sendFriendRequest,
  FriendRequest,
  FriendUser,
} from "../../services/friendService";

export default function FriendsScreen() {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<FriendUser[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      const [friendList, requestList] = await Promise.all([
        getFriends(),
        getFriendRequests(),
      ]);
      setFriends(friendList ?? []);
      setRequests(requestList ?? []);
    } catch (error: any) {
      console.error("Failed to load friends:", error);
      Alert.alert("Friends", error?.message || "Unable to load your friends.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFriends();
    }, [loadFriends])
  );

  const handleSearch = async (text: string) => {
    setSearch(text);

    const query = text.trim();
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);
      const users = await searchUsers(query);
      setResults(users ?? []);
    } catch (error: any) {
      console.error("User search failed:", error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (user: FriendUser) => {
    try {
      await sendFriendRequest(user.id);
      setResults((current) => current.filter((item) => item.id !== user.id));
      Alert.alert("Friend request sent", `Your request was sent to ${user.name}.`);
    } catch (error: any) {
      Alert.alert("Unable to add friend", error?.message || "Please try again.");
    }
  };

  const handleAccept = async (request: FriendRequest) => {
    try {
      await acceptFriendRequest(request.friendshipId);
      await loadFriends();
    } catch (error: any) {
      Alert.alert("Unable to accept request", error?.message || "Please try again.");
    }
  };

  const handleDecline = async (request: FriendRequest) => {
    try {
      await declineFriendRequest(request.friendshipId);
      await loadFriends();
    } catch (error: any) {
      Alert.alert("Unable to decline request", error?.message || "Please try again.");
    }
  };

  const createRoom = () => {
    router.push("/study-room/create" as any);
  };

  const joinRoom = () => {
    const code = inviteCode.trim();
    if (!code) {
      Alert.alert(
        "Enter a room code",
        "Ask your friend for their StudyFlow room code or invite link."
      );
      return;
    }
    router.push({ pathname: "/study-room/[code]", params: { code } } as any);
  };

  const initials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Study together</Text>
            <Text style={styles.title}>Friends</Text>
            <Text style={styles.subtitle}>
              Connect with classmates and study together.
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>👥</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>🎓</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Study with your people</Text>
            <Text style={styles.heroSubtitle}>
              Add classmates, create private rooms, and chat in real time.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Find People</Text>
        <View style={styles.searchCard}>
          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search by name or email"
            placeholderTextColor="#9AA0AE"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />

          {searching && <ActivityIndicator size="small" color="#6C63FF" />}

          {search.length > 0 && !searching && results.length === 0 && (
            <Text style={styles.emptySearch}>No users found.</Text>
          )}

          {results.map((user) => (
            <View key={user.id} style={styles.searchResult}>
              <View style={styles.avatar}>
                {user.profileImage ? (
                  <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{initials(user.name)}</Text>
                )}
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{user.name}</Text>
                <Text style={styles.friendSubtitle}>{user.email}</Text>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => handleAddFriend(user)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {requests.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Friend Requests</Text>
              <View style={styles.requestBadge}>
                <Text style={styles.requestBadgeText}>{requests.length}</Text>
              </View>
            </View>

            <View style={styles.friendsCard}>
              {requests.map((request, index) => (
                <View key={request.friendshipId}>
                  <View style={styles.friendRow}>
                    <View style={styles.avatar}>
                      {request.user.profileImage ? (
                        <Image
                          source={{ uri: request.user.profileImage }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {initials(request.user.name)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{request.user.name}</Text>
                      <Text style={styles.friendSubtitle}>{request.user.email}</Text>
                    </View>
                    <View style={styles.requestActions}>
                      <Pressable
                        style={styles.acceptButton}
                        onPress={() => handleAccept(request)}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </Pressable>
                      <Pressable
                        style={styles.declineButton}
                        onPress={() => handleDecline(request)}
                      >
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </Pressable>
                    </View>
                  </View>
                  {index < requests.length - 1 && <View style={styles.friendDivider} />}
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Study Rooms</Text>
        <View style={styles.actionsCard}>
          <Pressable style={styles.primaryAction} onPress={createRoom}>
            <Text style={styles.primaryActionIcon}>＋</Text>
            <View style={styles.actionText}>
              <Text style={styles.primaryActionTitle}>Create Study Room</Text>
              <Text style={styles.primaryActionSubtitle}>
                Start a shared session with friends
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.joinBlock}>
            <Text style={styles.joinTitle}>Join with a code</Text>
            <Text style={styles.joinSubtitle}>
              Use a code shared by a friend or classmate.
            </Text>
            <View style={styles.joinRow}>
              <TextInput
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="e.g. SF-7K2P"
                placeholderTextColor="#9AA0AE"
                autoCapitalize="characters"
                style={styles.input}
              />
              <Pressable style={styles.joinButton} onPress={joinRoom}>
                <Text style={styles.joinButtonText}>Join</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your Friends</Text>
          {!loading && (
            <Text style={styles.friendCount}>
              {friends.length} {friends.length === 1 ? "friend" : "friends"}
            </Text>
          )}
        </View>

        <View style={styles.friendsCard}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.loadingText}>Loading friends...</Text>
            </View>
          ) : friends.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>👋</Text>
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptyText}>
                Search for classmates above and send them a friend request.
              </Text>
            </View>
          ) : (
            friends.map((friend, index) => (
              <View key={friend.id}>
                <View style={styles.friendRow}>
                  <View style={styles.avatarWrap}>
                    <View style={styles.avatar}>
                      {friend.profileImage ? (
                        <Image
                          source={{ uri: friend.profileImage }}
                          style={styles.avatarImage}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {initials(friend.name)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendSubtitle}>{friend.email}</Text>
                  </View>
                  <Pressable style={styles.inviteButton} onPress={createRoom}>
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </Pressable>
                </View>
                {index < friends.length - 1 && <View style={styles.friendDivider} />}
              </View>
            ))
          )}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🔗</Text>
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Share outside StudyFlow</Text>
            <Text style={styles.tipSubtitle}>
              Study room codes and links can be shared through WhatsApp,
              Discord, Instagram, or another app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: {
    padding: 20,
    paddingBottom: 36,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#171827" },
  subtitle: { fontSize: 13, color: "#77798A", marginTop: 5 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { fontSize: 22 },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171827",
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#292A3B",
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconText: { fontSize: 23 },
  heroText: { flex: 1, marginLeft: 14 },
  heroTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  heroSubtitle: { color: "#B8BBC7", fontSize: 12, lineHeight: 18, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171827",
    marginBottom: 11,
    marginTop: 3,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendCount: { color: "#77798A", fontSize: 12, marginBottom: 11 },
  requestBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
  requestBadgeText: { color: "#5D55E7", fontWeight: "800", fontSize: 12 },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 25,
    gap: 10,
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#171827",
    backgroundColor: "#F9FAFC",
  },
  searchResult: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  emptySearch: { color: "#77798A", fontSize: 12, paddingVertical: 5 },
  addButton: {
    borderRadius: 10,
    backgroundColor: "#6C63FF",
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  addButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    marginBottom: 25,
    overflow: "hidden",
  },
  primaryAction: { flexDirection: "row", alignItems: "center", padding: 16 },
  primaryActionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#171827",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 44,
    fontSize: 28,
  },
  actionText: { flex: 1, marginLeft: 13 },
  primaryActionTitle: { fontSize: 15, fontWeight: "800", color: "#171827" },
  primaryActionSubtitle: { fontSize: 12, color: "#77798A", marginTop: 3 },
  actionArrow: { fontSize: 27, color: "#9AA0AE", marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#E5E6EE" },
  joinBlock: { padding: 16 },
  joinTitle: { fontSize: 14, fontWeight: "800", color: "#171827" },
  joinSubtitle: { fontSize: 12, color: "#77798A", marginTop: 3, marginBottom: 11 },
  joinRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#171827",
    backgroundColor: "#F9FAFC",
  },
  joinButton: {
    height: 46,
    paddingHorizontal: 19,
    borderRadius: 12,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  friendsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  friendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarText: { fontSize: 15, fontWeight: "800", color: "#5148D8" },
  friendInfo: { flex: 1, marginLeft: 12 },
  friendName: { fontSize: 14, fontWeight: "800", color: "#171827" },
  friendSubtitle: { fontSize: 11, color: "#77798A", marginTop: 3 },
  inviteButton: {
    borderWidth: 1,
    borderColor: "#D9D7FF",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  inviteButtonText: { color: "#5D55E7", fontSize: 12, fontWeight: "800" },
  friendDivider: { height: 1, backgroundColor: "#ECECF2" },
  requestActions: { flexDirection: "row", gap: 6 },
  acceptButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  acceptButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  declineButton: {
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  declineButtonText: { color: "#77798A", fontSize: 11, fontWeight: "800" },
  loadingBox: { alignItems: "center", justifyContent: "center", paddingVertical: 28, gap: 9 },
  loadingText: { color: "#77798A", fontSize: 12 },
  emptyBox: { alignItems: "center", padding: 25 },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyTitle: { color: "#171827", fontSize: 15, fontWeight: "800" },
  emptyText: { color: "#77798A", fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 5 },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 16,
    padding: 14,
  },
  tipIcon: { fontSize: 20 },
  tipText: { flex: 1, marginLeft: 11 },
  tipTitle: { fontSize: 13, fontWeight: "800", color: "#312E81" },
  tipSubtitle: { fontSize: 11, lineHeight: 17, color: "#66648A", marginTop: 3 },
});
