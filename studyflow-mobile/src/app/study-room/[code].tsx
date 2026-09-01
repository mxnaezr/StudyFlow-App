import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { connectToStudyRoom, disconnectFromStudyRoom, sendStudyRoomMessage, StudyRoomMessage } from "../../services/websocketService";

export default function StudyRoomScreen() {
  const params = useLocalSearchParams<{ code?: string; name?: string; subject?: string }>();
  const code = String(params.code ?? "");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<StudyRoomMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connectToStudyRoom((incoming) => {
      if (incoming.roomCode === code) setMessages((current) => [...current, incoming]);
    }, code, () => setConnected(true), () => setConnected(false));

    return () => disconnectFromStudyRoom();
  }, [code]);

  const sendMessage = () => {
    const value = message.trim();
    if (!value) return;
    sendStudyRoomMessage(code, "You", value);
    setMessage("");
  };

  const copyInvite = () => {
    Alert.alert("Invite code", `Share this StudyFlow room code with your friends: ${code}`);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{params.name || "Study Room"}</Text>
            <Text style={styles.subtitle}>{params.subject || "Shared study session"}</Text>
          </View>
          <View style={[styles.status, connected && styles.statusConnected]}><Text style={styles.statusText}>{connected ? "Live" : "Offline"}</Text></View>
        </View>

        <View style={styles.inviteCard}>
          <View style={styles.inviteText}><Text style={styles.inviteLabel}>ROOM CODE</Text><Text style={styles.code}>{code}</Text></View>
          <Pressable style={styles.shareButton} onPress={copyInvite}><Text style={styles.shareButtonText}>Share</Text></Pressable>
        </View>

        <View style={styles.chatCard}>
          <View style={styles.chatHeader}><Text style={styles.chatTitle}>Room Chat</Text><Text style={styles.memberText}>Study together</Text></View>
          <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
            {messages.length === 0 ? (
              <View style={styles.empty}><Text style={styles.emptyIcon}>💬</Text><Text style={styles.emptyTitle}>Start the conversation</Text><Text style={styles.emptyText}>Messages from everyone in this room will appear here.</Text></View>
            ) : messages.map((item, index) => (
              <View key={`${item.sender}-${index}`} style={styles.message}><Text style={styles.sender}>{item.sender}</Text><Text style={styles.messageText}>{item.message}</Text></View>
            ))}
          </ScrollView>
          <View style={styles.composer}><TextInput value={message} onChangeText={setMessage} placeholder="Write a message..." placeholderTextColor="#9AA0AE" style={styles.input} onSubmitEditing={sendMessage} /><Pressable style={styles.sendButton} onPress={sendMessage}><Text style={styles.sendText}>↑</Text></Pressable></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  container: { flex: 1, width: "100%", maxWidth: 760, alignSelf: "center", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 30, color: "#171827", lineHeight: 34 },
  headerText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#171827" },
  subtitle: { fontSize: 12, color: "#77798A", marginTop: 2 },
  status: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: "#EEEFF4" },
  statusConnected: { backgroundColor: "#E7F8EE" },
  statusText: { fontSize: 11, fontWeight: "800", color: "#77798A" },
  inviteCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#171827", borderRadius: 18, padding: 16, marginBottom: 15 },
  inviteText: { flex: 1 },
  inviteLabel: { fontSize: 9, color: "#AEB1BD", fontWeight: "800", letterSpacing: 1 },
  code: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", letterSpacing: 1, marginTop: 3 },
  shareButton: { backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  shareButtonText: { color: "#171827", fontSize: 12, fontWeight: "800" },
  chatCard: { flex: 1, minHeight: 400, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 18, overflow: "hidden" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ECECF2" },
  chatTitle: { fontSize: 15, fontWeight: "800", color: "#171827" },
  memberText: { fontSize: 11, color: "#77798A" },
  messages: { flex: 1 },
  messagesContent: { padding: 15, flexGrow: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  emptyIcon: { fontSize: 30, marginBottom: 10 },
  emptyTitle: { fontSize: 15, fontWeight: "800", color: "#171827" },
  emptyText: { fontSize: 12, lineHeight: 18, color: "#77798A", textAlign: "center", marginTop: 5 },
  message: { alignSelf: "flex-start", backgroundColor: "#F1F1F8", borderRadius: 13, padding: 10, marginBottom: 9, maxWidth: "85%" },
  sender: { fontSize: 10, fontWeight: "800", color: "#6C63FF", marginBottom: 3 },
  messageText: { fontSize: 13, color: "#343546", lineHeight: 18 },
  composer: { flexDirection: "row", padding: 12, borderTopWidth: 1, borderTopColor: "#ECECF2", gap: 8 },
  input: { flex: 1, height: 44, backgroundColor: "#F7F8FC", borderWidth: 1, borderColor: "#E1E2EA", borderRadius: 12, paddingHorizontal: 13, fontSize: 13, color: "#171827" },
  sendButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#6C63FF", alignItems: "center", justifyContent: "center" },
  sendText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
});
