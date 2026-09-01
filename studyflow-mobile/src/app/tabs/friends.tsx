import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const friends = [
  { id: "1", name: "Alex", subtitle: "Computer Science", initials: "A", online: true },
  { id: "2", name: "Sarah", subtitle: "Software Engineering", initials: "S", online: true },
  { id: "3", name: "Daniel", subtitle: "Information Technology", initials: "D", online: false },
];

export default function FriendsScreen() {
  const [inviteCode, setInviteCode] = useState("");

  const createRoom = () => {
    router.push("/study-room/create");
  };

  const joinRoom = () => {
    const code = inviteCode.trim();
    if (!code) {
      Alert.alert("Enter a room code", "Ask your friend for their StudyFlow room code or invite link.");
      return;
    }
    router.push({ pathname: "/study-room/[code]", params: { code } });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Study together</Text>
            <Text style={styles.title}>Friends</Text>
            <Text style={styles.subtitle}>Connect with classmates and study together.</Text>
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
            <Text style={styles.heroSubtitle}>Create a private room, invite friends, and chat in real time.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Study Rooms</Text>
        <View style={styles.actionsCard}>
          <Pressable style={styles.primaryAction} onPress={createRoom}>
            <Text style={styles.primaryActionIcon}>＋</Text>
            <View style={styles.actionText}>
              <Text style={styles.primaryActionTitle}>Create Study Room</Text>
              <Text style={styles.primaryActionSubtitle}>Start a shared session with friends</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.joinBlock}>
            <Text style={styles.joinTitle}>Join with a code</Text>
            <Text style={styles.joinSubtitle}>Use a code shared by a friend or classmate.</Text>
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

        <Text style={styles.sectionTitle}>Your Friends</Text>
        <View style={styles.friendsCard}>
          {friends.map((friend, index) => (
            <View key={friend.id}>
              <View style={styles.friendRow}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{friend.initials}</Text>
                  </View>
                  <View style={[styles.statusDot, friend.online && styles.statusOnline]} />
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendSubtitle}>{friend.subtitle}</Text>
                </View>
                <Pressable style={styles.inviteButton} onPress={createRoom}>
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </Pressable>
              </View>
              {index < friends.length - 1 && <View style={styles.friendDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🔗</Text>
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Share outside StudyFlow</Text>
            <Text style={styles.tipSubtitle}>Your room code can later be shared through WhatsApp, Discord, Instagram, or another app.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 20, paddingBottom: 36, maxWidth: 760, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  eyebrow: { fontSize: 12, fontWeight: "700", color: "#6C63FF", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 },
  title: { fontSize: 30, fontWeight: "800", color: "#171827" },
  subtitle: { fontSize: 13, color: "#77798A", marginTop: 5 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#ECEBFF", alignItems: "center", justifyContent: "center" },
  headerIconText: { fontSize: 22 },
  heroCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#171827", borderRadius: 20, padding: 18, marginBottom: 26 },
  heroIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#292A3B", alignItems: "center", justifyContent: "center" },
  heroIconText: { fontSize: 23 },
  heroText: { flex: 1, marginLeft: 14 },
  heroTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  heroSubtitle: { color: "#B8BBC7", fontSize: 12, lineHeight: 18, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#171827", marginBottom: 11, marginTop: 3 },
  actionsCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 18, marginBottom: 25, overflow: "hidden" },
  primaryAction: { flexDirection: "row", alignItems: "center", padding: 16 },
  primaryActionIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: "#171827", color: "#FFFFFF", textAlign: "center", lineHeight: 44, fontSize: 28 },
  actionText: { flex: 1, marginLeft: 13 },
  primaryActionTitle: { fontSize: 15, fontWeight: "800", color: "#171827" },
  primaryActionSubtitle: { fontSize: 12, color: "#77798A", marginTop: 3 },
  actionArrow: { fontSize: 27, color: "#9AA0AE", marginLeft: 8 },
  divider: { height: 1, backgroundColor: "#E5E6EE" },
  joinBlock: { padding: 16 },
  joinTitle: { fontSize: 14, fontWeight: "800", color: "#171827" },
  joinSubtitle: { fontSize: 12, color: "#77798A", marginTop: 3, marginBottom: 11 },
  joinRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, height: 46, borderWidth: 1, borderColor: "#E0E1E9", borderRadius: 12, paddingHorizontal: 13, fontSize: 14, color: "#171827", backgroundColor: "#F9FAFC" },
  joinButton: { height: 46, paddingHorizontal: 19, borderRadius: 12, backgroundColor: "#6C63FF", alignItems: "center", justifyContent: "center" },
  joinButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  friendsCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 18, paddingHorizontal: 15, marginBottom: 16 },
  friendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  avatarWrap: { position: "relative" },
  avatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: "#ECEBFF", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "800", color: "#5148D8" },
  statusDot: { position: "absolute", right: -1, bottom: -1, width: 13, height: 13, borderRadius: 7, backgroundColor: "#BFC2CC", borderWidth: 2, borderColor: "#FFFFFF" },
  statusOnline: { backgroundColor: "#35B86B" },
  friendInfo: { flex: 1, marginLeft: 12 },
  friendName: { fontSize: 14, fontWeight: "800", color: "#171827" },
  friendSubtitle: { fontSize: 11, color: "#77798A", marginTop: 3 },
  inviteButton: { borderWidth: 1, borderColor: "#D9D7FF", borderRadius: 10, paddingHorizontal: 13, paddingVertical: 8 },
  inviteButtonText: { color: "#5D55E7", fontSize: 12, fontWeight: "800" },
  friendDivider: { height: 1, backgroundColor: "#ECECF2" },
  tipCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0F0FF", borderRadius: 16, padding: 14 },
  tipIcon: { fontSize: 20 },
  tipText: { flex: 1, marginLeft: 11 },
  tipTitle: { fontSize: 13, fontWeight: "800", color: "#312E81" },
  tipSubtitle: { fontSize: 11, lineHeight: 17, color: "#66648A", marginTop: 3 },
});
