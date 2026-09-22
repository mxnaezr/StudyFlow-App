import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getCurrentUser } from "../../services/authService";
import { getStudySessions, StudySession } from "../../services/studySessionService";

export default function Statistics() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        setSessions([]);
        return;
      }
      setSessions(await getStudySessions(user.id));
    } catch (error) {
      console.error("Failed to load study sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const statistics = useMemo(() => {
    const totalMinutes = sessions.reduce(
      (total, session) => total + Number(session.duration || session.durationMinutes || 0),
      0
    );

    const completedSessions = sessions.filter(
      (session) => session.status?.toLowerCase() === "completed"
    ).length;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weeklySessions = sessions.filter((session) => {
      if (!session.startTime) return false;
      const date = new Date(session.startTime);
      return !Number.isNaN(date.getTime()) && date >= weekStart && date <= now;
    });

    const subjectMap: Record<string, { name: string; minutes: number; sessions: number }> = {};

    sessions.forEach((session) => {
      const name = session.subjectName ||
        (session.subjectId ? `Subject ${session.subjectId}` : "Other");
      if (!subjectMap[name]) subjectMap[name] = { name, minutes: 0, sessions: 0 };
      subjectMap[name].minutes += Number(session.duration || session.durationMinutes || 0);
      subjectMap[name].sessions += 1;
    });

    const subjectStats = Object.values(subjectMap).sort((a, b) => b.minutes - a.minutes);

    return {
      totalMinutes,
      totalSessions: sessions.length,
      completedSessions,
      weeklySessions: weeklySessions.length,
      weeklyMinutes: weeklySessions.reduce(
        (total, session) => total + Number(session.duration || session.durationMinutes || 0),
        0
      ),
      subjectStats,
    };
  }, [sessions]);

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.muted}>Loading statistics...</Text>
      </View>
    );
  }

  const topSubject = statistics.subjectStats[0];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSessions(); }} />
        }
      >
        <Text style={styles.eyebrow}>YOUR PROGRESS</Text>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>See how your study time is adding up.</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total study time</Text>
          <Text style={styles.totalValue}>{formatMinutes(statistics.totalMinutes)}</Text>
          <Text style={styles.totalSubtext}>{statistics.totalSessions} study sessions</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}><Text style={styles.value}>{statistics.totalSessions}</Text><Text style={styles.label}>Total Sessions</Text></View>
          <View style={styles.card}><Text style={styles.value}>{statistics.weeklySessions}</Text><Text style={styles.label}>Last 7 Days</Text></View>
          <View style={styles.card}><Text style={styles.value}>{formatMinutes(statistics.weeklyMinutes)}</Text><Text style={styles.label}>This Week</Text></View>
          <View style={styles.card}><Text style={styles.value}>{statistics.completedSessions}</Text><Text style={styles.label}>Completed</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Most Studied Subject</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>{topSubject?.name || "No study data yet"}</Text>
          <Text style={styles.featureText}>
            {topSubject ? `${formatMinutes(topSubject.minutes)} across ${topSubject.sessions} sessions` : "Start a study session to see your progress."}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Study Time by Subject</Text>
        <View style={styles.subjectCard}>
          {statistics.subjectStats.length === 0 ? (
            <Text style={styles.muted}>No subject statistics available yet.</Text>
          ) : (
            statistics.subjectStats.map((subject, index) => {
              const max = statistics.subjectStats[0].minutes || 1;
              const percentage = Math.min(100, (subject.minutes / max) * 100);
              return (
                <View key={subject.name} style={styles.subjectItem}>
                  <View style={styles.row}>
                    <Text style={styles.subjectName}>{index + 1}. {subject.name}</Text>
                    <Text style={styles.subjectTime}>{formatMinutes(subject.minutes)}</Text>
                  </View>
                  <View style={styles.progressBackground}>
                    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.sessionCount}>{subject.sessions} {subject.sessions === 1 ? "session" : "sessions"}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 20, paddingBottom: 110, maxWidth: 760, width: "100%", alignSelf: "center" },
  loading: { flex: 1, backgroundColor: "#F7F8FC", alignItems: "center", justifyContent: "center" },
  muted: { color: "#77798A", fontSize: 13, marginTop: 8 },
  eyebrow: { fontSize: 12, fontWeight: "700", color: "#4F46E5", letterSpacing: 0.8 },
  title: { fontSize: 30, fontWeight: "800", color: "#171827", marginTop: 3 },
  subtitle: { fontSize: 13, color: "#77798A", marginTop: 5, marginBottom: 22 },
  totalCard: { backgroundColor: "#171827", borderRadius: 20, padding: 20, marginBottom: 16 },
  totalLabel: { color: "#B8BBC7", fontSize: 12 },
  totalValue: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 4 },
  totalSubtext: { color: "#B8BBC7", fontSize: 11, marginTop: 3 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  card: { flexGrow: 1, width: "47%", minWidth: 130, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 16, padding: 15 },
  value: { fontSize: 21, fontWeight: "800", color: "#171827" },
  label: { fontSize: 11, color: "#77798A", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#171827", marginBottom: 10, marginTop: 3 },
  featureCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 18, padding: 17, marginBottom: 24 },
  featureTitle: { fontSize: 17, fontWeight: "800", color: "#171827" },
  featureText: { fontSize: 12, color: "#77798A", marginTop: 5 },
  subjectCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6EE", borderRadius: 18, padding: 16 },
  subjectItem: { marginBottom: 17 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subjectName: { flex: 1, fontSize: 13, fontWeight: "700", color: "#171827" },
  subjectTime: { fontSize: 12, fontWeight: "700", color: "#4F46E5" },
  progressBackground: { height: 7, borderRadius: 4, backgroundColor: "#ECECF2", overflow: "hidden", marginTop: 8 },
  progressBar: { height: "100%", backgroundColor: "#4F46E5", borderRadius: 4 },
  sessionCount: { fontSize: 10, color: "#8B8FA3", marginTop: 5 },
});
