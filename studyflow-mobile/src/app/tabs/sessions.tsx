import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  StudySession,
  getStudySessions,
  deleteStudySession,
} from "../../services/studySessionService";

export default function Sessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSessions = async () => {
    try {
      const data = await getStudySessions();
      setSessions(data || []);
    } catch (error: any) {
      console.error("Failed to load sessions:", error);

      Alert.alert(
        "Unable to load sessions",
        error?.message || "Could not connect to the server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const refreshSessions = () => {
    setRefreshing(true);
    loadSessions();
  };

  const handleDelete = (session: StudySession) => {
    Alert.alert(
      "Delete Study Session",
      `Are you sure you want to delete "${session.title || "this session"}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStudySession(session.id);

              setSessions((current) =>
                current.filter((item) => item.id !== session.id)
              );
            } catch (error: any) {
              Alert.alert(
                "Delete failed",
                error?.message || "Could not delete the session."
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "No date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "No duration";

    const minutes = Number(duration);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshSessions}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>YOUR ACTIVITY</Text>

            <Text style={styles.title}>Study Sessions</Text>

            <Text style={styles.subtitle}>
              Keep track of your study time and progress.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="timer-outline"
              size={25}
              color="#4F46E5"
            />
          </View>
        </View>

        {/* CREATE SESSION */}
        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/study-session/create" as any)}
        >
          <View style={styles.createIcon}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </View>

          <View style={styles.createText}>
            <Text style={styles.createTitle}>
              Start a Study Session
            </Text>

            <Text style={styles.createSubtitle}>
              Record a new study session
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        {/* SECTION TITLE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>

          <Text style={styles.sessionCount}>
            {sessions.length}{" "}
            {sessions.length === 1 ? "session" : "sessions"}
          </Text>
        </View>

        {/* LOADING */}
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#4F46E5" />

            <Text style={styles.stateText}>
              Loading your sessions...
            </Text>
          </View>
        ) : sessions.length === 0 ? (
          /* EMPTY STATE */
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="book-outline"
                size={32}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No study sessions yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Start your first study session and your activity
              will appear here.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={() =>
                router.push("/study-session/create" as any)
              }
            >
              <Text style={styles.emptyButtonText}>
                Start Studying
              </Text>
            </Pressable>
          </View>
        ) : (
          /* SESSION LIST */
          <View style={styles.sessionsCard}>
            {sessions.map((session, index) => (
              <View key={session.id}>
                <View style={styles.sessionRow}>
                  {/* ICON */}
                  <View style={styles.sessionIcon}>
                    <Ionicons
                      name="time-outline"
                      size={23}
                      color="#4F46E5"
                    />
                  </View>

                  {/* INFORMATION */}
                  <View style={styles.sessionInfo}>
                    <Text
                      style={styles.sessionTitle}
                      numberOfLines={1}
                    >
                      {session.title || "Study Session"}
                    </Text>

                    <Text style={styles.subjectName}>
                      {session.subjectName ||
                        (session.subjectId
                          ? `Subject #${session.subjectId}`
                          : "General Study")}
                    </Text>

                    <View style={styles.sessionMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={13}
                          color="#8B8FA3"
                        />

                        <Text style={styles.metaText}>
                          {formatDate(session.startTime)}
                        </Text>
                      </View>

                      {session.startTime && (
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={13}
                            color="#8B8FA3"
                          />

                          <Text style={styles.metaText}>
                            {formatTime(session.startTime)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* RIGHT SIDE */}
                  <View style={styles.sessionRight}>
                    <Text style={styles.duration}>
                      {formatDuration(session.duration)}
                    </Text>

                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDelete(session)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#EF4444"
                      />
                    </Pressable>
                  </View>
                </View>

                {index < sessions.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    padding: 20,
    paddingBottom: 110,
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

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 4,
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
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171827",
    borderRadius: 18,
    padding: 15,
    marginBottom: 28,
  },

  createIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  createText: {
    flex: 1,
    marginLeft: 13,
  },

  createTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  createSubtitle: {
    color: "#B8BBC7",
    fontSize: 12,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171827",
  },

  sessionCount: {
    fontSize: 12,
    color: "#77798A",
  },

  sessionsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    paddingHorizontal: 15,
    overflow: "hidden",
  },

  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  sessionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  sessionInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  sessionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#171827",
  },

  subjectName: {
    fontSize: 11,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 3,
  },

  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 10,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontSize: 10,
    color: "#8B8FA3",
  },

  sessionRight: {
    alignItems: "flex-end",
  },

  duration: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 7,
  },

  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECF2",
  },

  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },

  stateText: {
    fontSize: 13,
    color: "#77798A",
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#171827",
  },

  emptySubtitle: {
    fontSize: 12,
    color: "#77798A",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 330,
  },

  emptyButton: {
    marginTop: 18,
    backgroundColor: "#4F46E5",
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});