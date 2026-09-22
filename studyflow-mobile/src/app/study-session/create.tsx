import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getCurrentUser } from "../../services/authService";
import { getSubjects, Subject } from "../../services/subjectService";
import { createStudySession } from "../../services/studySessionService";

export default function CreateStudySession() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
        if (data.length > 0) setSelectedSubjectId(data[0].id);
      } catch (error: any) {
        Alert.alert("Unable to load subjects", error?.message || "Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    const user = await getCurrentUser();
    const minutes = Number(duration);

    if (!user?.id) {
      Alert.alert("Login required", "Please log in before creating a study session.");
      return;
    }

    if (!selectedSubjectId) {
      Alert.alert("Select a subject", "Please choose a subject for this session.");
      return;
    }

    if (!Number.isFinite(minutes) || minutes <= 0) {
      Alert.alert("Invalid duration", "Enter a study duration greater than 0 minutes.");
      return;
    }

    setSaving(true);

    try {
      const start = new Date();
      const end = new Date(start.getTime() + minutes * 60 * 1000);

      await createStudySession({
        userId: user.id,
        subjectId: selectedSubjectId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        durationMinutes: Math.round(minutes),
        notes: notes.trim() || undefined,
      });

      Alert.alert("Session created", "Your study session has been saved.", [
        { text: "OK", onPress: () => router.replace("/tabs/sessions") },
      ]);
    } catch (error: any) {
      Alert.alert("Could not create session", error?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#171827" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>STUDYFLOW</Text>
            <Text style={styles.title}>New Study Session</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.muted}>Loading subjects...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.subjectList}>
              {subjects.length === 0 ? (
                <Text style={styles.muted}>Create a subject first.</Text>
              ) : (
                subjects.map((subject) => {
                  const selected = selectedSubjectId === subject.id;
                  return (
                    <Pressable
                      key={subject.id}
                      style={[styles.subjectOption, selected && styles.subjectOptionSelected]}
                      onPress={() => setSelectedSubjectId(subject.id)}
                    >
                      <View style={[styles.subjectDot, { backgroundColor: subject.color || "#4F46E5" }]} />
                      <Text style={[styles.subjectText, selected && styles.subjectTextSelected]}>
                        {subject.name}
                      </Text>
                      {selected && <Ionicons name="checkmark-circle" size={21} color="#4F46E5" />}
                    </Pressable>
                  );
                })
              )}
            </View>

            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="30"
              placeholderTextColor="#9A9CAB"
            />

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, styles.notes]}
              placeholder="What are you studying?"
              placeholderTextColor="#9A9CAB"
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.createButton, saving && styles.disabled]}
              disabled={saving || subjects.length === 0}
              onPress={handleCreate}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="play" size={19} color="#FFFFFF" />
                  <Text style={styles.createButtonText}>Save Study Session</Text>
                </>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 20, paddingBottom: 50, maxWidth: 760, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E6EE" },
  headerText: { marginLeft: 13 },
  eyebrow: { fontSize: 11, fontWeight: "800", color: "#4F46E5", letterSpacing: 0.8 },
  title: { fontSize: 27, fontWeight: "800", color: "#171827", marginTop: 2 },
  label: { fontSize: 14, fontWeight: "800", color: "#171827", marginBottom: 9, marginTop: 16 },
  subjectList: { gap: 9 },
  subjectOption: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 14, padding: 14 },
  subjectOptionSelected: { borderColor: "#4F46E5", backgroundColor: "#F3F2FF" },
  subjectDot: { width: 12, height: 12, borderRadius: 6, marginRight: 11 },
  subjectText: { flex: 1, fontSize: 14, fontWeight: "600", color: "#4B4D5D" },
  subjectTextSelected: { color: "#171827", fontWeight: "800" },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: "#171827" },
  notes: { minHeight: 110 },
  createButton: { marginTop: 25, minHeight: 52, borderRadius: 15, backgroundColor: "#4F46E5", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 },
  createButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  disabled: { opacity: 0.55 },
  loading: { alignItems: "center", paddingVertical: 80 },
  muted: { color: "#77798A", fontSize: 13, marginTop: 10 },
});
