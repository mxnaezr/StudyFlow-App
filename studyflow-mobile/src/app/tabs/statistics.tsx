import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getStudySessions,
  StudySession,
} from "../../services/studySessionService";

export default function Statistics() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ============================================================
  // LOAD STUDY SESSIONS
  // ============================================================

  const loadSessions = useCallback(async () => {
    try {
      const data = await getStudySessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load study sessions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const totalSessions = sessions.length;

    const totalMinutes = sessions.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);

    const completedSessions = sessions.filter(
      (session) =>
        session.status?.toLowerCase() === "completed"
    ).length;

    // ----------------------------------------------------------
    // SUBJECT STATISTICS
    // ----------------------------------------------------------

    const subjectMap: Record<
      string,
      {
        name: string;
        minutes: number;
        sessions: number;
      }
    > = {};

    sessions.forEach((session) => {
      const subjectName =
        session.subjectName ||
        (session.subjectId
          ? `Subject ${session.subjectId}`
          : "Other");

      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          name: subjectName,
          minutes: 0,
          sessions: 0,
        };
      }

      subjectMap[subjectName].minutes += session.duration || 0;
      subjectMap[subjectName].sessions += 1;
    });

    const subjectStats = Object.values(subjectMap).sort(
      (a, b) => b.minutes - a.minutes
    );

    const mostStudiedSubject =
      subjectStats.length > 0
        ? subjectStats[0]
        : null;

    // ----------------------------------------------------------
    // WEEKLY STATISTICS
    // ----------------------------------------------------------

    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weeklySessions = sessions.filter((session) => {
      if (!session.startTime) return false;

      const date = new Date(session.startTime);

      return date >= weekStart && date <= now;
    });

    const weeklyMinutes = weeklySessions.reduce(
      (total, session) => total + (session.duration || 0),
      0
    );

    return {
      totalSessions,
      totalMinutes,
      completedSessions,
      weeklySessions: weeklySessions.length,
      weeklyMinutes,
      subjectStats,
      mostStudiedSubject,
    };
  }, [sessions]);

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) {
      return `${mins}m`;
    }

    if (mins === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text style={styles.loadingText}>
          Loading statistics...
        </Text>
      </View>
    );
  }

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C63FF"
          />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              Your progress
            </Text>

            <Text style={styles.title}>
              Statistics
            </Text>

            <Text style={styles.subtitle}>
              See how your study time is adding up.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>
              📊
            </Text>
          </View>
        </View>

        {/* MAIN TOTAL CARD */}

        <View style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <Text style={styles.totalIconText}>
              ⏱
            </Text>
          </View>

          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>
              Total study time
            </Text>

            <Text style={styles.totalValue}>
              {formatMinutes(statistics.totalMinutes)}
            </Text>

            <Text style={styles.totalSubtext}>
              Across {statistics.totalSessions}{" "}
              {statistics.totalSessions === 1
                ? "session"
                : "sessions"}
            </Text>
          </View>
        </View>

        {/* STAT CARDS */}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              📚
            </Text>

            <Text style={styles.statValue}>
              {statistics.totalSessions}
            </Text>

            <Text style={styles.statLabel}>
              Total Sessions
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              📅
            </Text>

            <Text style={styles.statValue}>
              {statistics.weeklySessions}
            </Text>

            <Text style={styles.statLabel}>
              Last 7 Days
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              ⏳
            </Text>

            <Text style={styles.statValue}>
              {formatMinutes(
                statistics.weeklyMinutes
              )}
            </Text>

            <Text style={styles.statLabel}>
              This Week
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              ✓
            </Text>

            <Text style={styles.statValue}>
              {statistics.completedSessions}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>
        </View>

        {/* MOST STUDIED SUBJECT */}

        <Text style={styles.sectionTitle}>
          Most Studied Subject
        </Text>

        {statistics.mostStudiedSubject ? (
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>
                🏆
              </Text>
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>
                {statistics.mostStudiedSubject.name}
              </Text>

              <Text style={styles.featureSubtitle}>
                {formatMinutes(
                  statistics.mostStudiedSubject.minutes
                )}{" "}
                studied
              </Text>
            </View>

            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>
                {statistics.mostStudiedSubject.sessions}
              </Text>

              <Text style={styles.featureBadgeLabel}>
                sessions
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📊
            </Text>

            <Text style={styles.emptyTitle}>
              No study data yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Start a study session and your
              statistics will appear here.
            </Text>
          </View>
        )}

        {/* SUBJECT BREAKDOWN */}

        <Text style={styles.sectionTitle}>
          Study Time by Subject
        </Text>

        {statistics.subjectStats.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptySubtitle}>
              No subject statistics available yet.
            </Text>
          </View>
        ) : (
          <View style={styles.subjectCard}>
            {statistics.subjectStats.map(
              (subject, index) => {
                const maxMinutes =
                  statistics.subjectStats[0].minutes;

                const percentage =
                  maxMinutes > 0
                    ? (subject.minutes /
                        maxMinutes) *
                      100
                    : 0;

                return (
                  <View
                    key={subject.name}
                    style={styles.subjectItem}
                  >
                    <View
                      style={styles.subjectHeader}
                    >
                      <View
                        style={styles.subjectNameContainer}
                      >
                        <View
                          style={[
                            styles.subjectNumber,
                            index === 0 &&
                              styles.subjectNumberFirst,
                          ]}
                        >
                          <Text
                            style={
                              styles.subjectNumberText
                            }
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <Text
                          style={styles.subjectName}
                        >
                          {subject.name}
                        </Text>
                      </View>

                      <Text
                        style={styles.subjectTime}
                      >
                        {formatMinutes(
                          subject.minutes
                        )}
                      </Text>
                    </View>

                    <View
                      style={styles.progressBackground}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${percentage}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={styles.sessionCount}
                    >
                      {subject.sessions}{" "}
                      {subject.sessions === 1
                        ? "session"
                        : "sessions"}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        )}

        {/* INFO */}

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>
            💡
          </Text>

          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              Keep studying
            </Text>

            <Text style={styles.infoSubtitle}>
              Your statistics are calculated from
              your StudyFlow study sessions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#77798A",
    fontSize: 14,
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#171827",
  },

  subtitle: {
    fontSize: 13,
    color: "#77798A",
    marginTop: 5,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconText: {
    fontSize: 22,
  },

  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171827",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  totalIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#292A3B",
    alignItems: "center",
    justifyContent: "center",
  },

  totalIconText: {
    color: "#FFFFFF",
    fontSize: 25,
  },

  totalInfo: {
    marginLeft: 15,
  },

  totalLabel: {
    color: "#B8BBC7",
    fontSize: 12,
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 2,
  },

  totalSubtext: {
    color: "#B8BBC7",
    fontSize: 11,
    marginTop: 2,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 25,
  },

  statCard: {
    width: "48%",
    flexGrow: 1,
    minWidth: 130,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 16,
    padding: 15,
  },

  statIcon: {
    fontSize: 20,
  },

  statValue: {
    fontSize: 21,
    fontWeight: "800",
    color: "#171827",
    marginTop: 8,
  },

  statLabel: {
    fontSize: 11,
    color: "#77798A",
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171827",
    marginBottom: 11,
    marginTop: 3,
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    padding: 16,
    marginBottom: 25,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFF7E6",
    alignItems: "center",
    justifyContent: "center",
  },

  featureIconText: {
    fontSize: 22,
  },

  featureInfo: {
    flex: 1,
    marginLeft: 13,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#171827",
  },

  featureSubtitle: {
    fontSize: 11,
    color: "#77798A",
    marginTop: 4,
  },

  featureBadge: {
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  featureBadgeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#5D55E7",
  },

  featureBadgeLabel: {
    fontSize: 9,
    color: "#77798A",
    marginTop: 1,
  },

  subjectCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  subjectItem: {
    paddingVertical: 15,
  },

  subjectHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subjectNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  subjectNumber: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: "#F0F0F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  subjectNumberFirst: {
    backgroundColor: "#ECEBFF",
  },

  subjectNumberText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#5D55E7",
  },

  subjectName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#171827",
  },

  subjectTime: {
    fontSize: 12,
    fontWeight: "800",
    color: "#5D55E7",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#ECECF2",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },

  progressBar: {
    height: 7,
    backgroundColor: "#6C63FF",
    borderRadius: 4,
  },

  sessionCount: {
    fontSize: 10,
    color: "#8B8FA3",
    marginTop: 5,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    marginBottom: 25,
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#171827",
  },

  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#77798A",
    textAlign: "center",
    marginTop: 5,
    maxWidth: 320,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },

  infoIcon: {
    fontSize: 20,
  },

  infoText: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#312E81",
  },

  infoSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    color: "#66648A",
    marginTop: 3,
  },
});