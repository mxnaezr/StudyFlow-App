import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function CreateStudyRoomScreen() {
  const [roomName, setRoomName] = useState("");
  const [subject, setSubject] = useState("");

  const createRoom = () => {
    const name = roomName.trim() || "Study Room";
    const code = `SF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    router.replace({ pathname: "/study-room/[code]", params: { code, name, subject: subject.trim() } });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.eyebrow}>COLLABORATION</Text>
        <Text style={styles.title}>Create a Study Room</Text>
        <Text style={styles.subtitle}>Set up a shared space for your friends and classmates.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Room name</Text>
          <TextInput value={roomName} onChangeText={setRoomName} placeholder="e.g. Database Revision" placeholderTextColor="#9AA0AE" style={styles.input} />

          <Text style={styles.label}>Subject (optional)</Text>
          <TextInput value={subject} onChangeText={setSubject} placeholder="e.g. Database Systems" placeholderTextColor="#9AA0AE" style={styles.input} />

          <View style={styles.info}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>Your room will have a unique invite code that you can share with your study group.</Text>
          </View>

          <Pressable style={styles.button} onPress={createRoom}>
            <Text style={styles.buttonText}>Create Room</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  container: { width: "100%", maxWidth: 560, alignSelf: "center", padding: 20, paddingTop: 28 },
  backButton: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  backText: { fontSize: 30, color: "#171827", lineHeight: 34 },
  eyebrow: { fontSize: 11, fontWeight: "800", color: "#6C63FF", letterSpacing: 1, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: "800", color: "#171827" },
  subtitle: { fontSize: 13, lineHeight: 20, color: "#77798A", marginTop: 6, marginBottom: 22 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#E5E6EE", padding: 20 },
  label: { fontSize: 13, fontWeight: "700", color: "#343546", marginBottom: 7, marginTop: 5 },
  input: { height: 50, borderWidth: 1, borderColor: "#E0E1E9", borderRadius: 12, paddingHorizontal: 14, fontSize: 14, color: "#171827", backgroundColor: "#FAFAFC", marginBottom: 16 },
  info: { flexDirection: "row", backgroundColor: "#F0F0FF", borderRadius: 13, padding: 13, marginTop: 2, marginBottom: 20 },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 11, lineHeight: 17, color: "#5E5C7D", marginLeft: 9 },
  button: { height: 50, borderRadius: 12, backgroundColor: "#171827", alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
