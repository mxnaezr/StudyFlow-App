import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getStudyCallHistory, StudyCallLog } from "../../services/studyCallService";

export default function StudyCallHistoryScreen() {
  const [logs, setLogs] = useState<StudyCallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setLogs(await getStudyCallHistory());
    } catch (error) {
      console.warn("Failed to load call history:", error);
      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "Less than a minute";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} />}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={21} color="#171827" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>COLLABORATION</Text>
            <Text style={styles.title}>Call History</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : logs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="call-outline" size={34} color="#4F46E5" />
            <Text style={styles.emptyTitle}>No calls yet</Text>
            <Text style={styles.emptyText}>Your completed StudyFlow group calls will appear here.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {logs.map((log, index) => (
              <View key={log.id} style={[styles.row, index < logs.length - 1 && styles.divider]}>
                <View style={styles.icon}>
                  <Ionicons name="call" size={17} color="#4F46E5" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.room}>Room {log.roomCode}</Text>
                  <Text style={styles.date}>{new Date(log.joinedAt).toLocaleString()}</Text>
                </View>
                <Text style={styles.duration}>{formatDuration(log.durationSeconds)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 20, paddingBottom: 40, maxWidth: 760, width: "100%", alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backButton: { width: 43, height: 43, borderRadius: 13, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", alignItems: "center", justifyContent: "center" },
  headerText: { marginLeft: 12 },
  eyebrow: { fontSize: 10, fontWeight: "800", color: "#4F46E5", letterSpacing: 0.8 },
  title: { fontSize: 27, fontWeight: "800", color: "#171827", marginTop: 2 },
  center: { paddingVertical: 80, alignItems: "center" },
  emptyCard: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E5E6EE", alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#171827", marginTop: 12 },
  emptyText: { color: "#77798A", fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 5, maxWidth: 320 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E5E6EE", paddingHorizontal: 15 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#ECECF2" },
  icon: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#ECEBFF", alignItems: "center", justifyContent: "center" },
  info: { flex: 1, marginLeft: 12 },
  room: { fontSize: 13, fontWeight: "800", color: "#171827" },
  date: { fontSize: 10, color: "#77798A", marginTop: 4 },
  duration: { fontSize: 11, fontWeight: "800", color: "#4F46E5" },
});
