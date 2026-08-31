import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.screen}>
      <View style={styles.appContainer}>

        {/* ================= HEADER ================= */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.userName}>Student</Text>
            </View>

            <Pressable
              style={styles.profileButton}
              onPress={() => router.push("/tabs/profile")}
            >
              <Text style={styles.profileLetter}>S</Text>
            </Pressable>
          </View>

          {/* ================= WELCOME ================= */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              Ready to study?
            </Text>

            <Text style={styles.welcomeSubtitle}>
              Keep your focus and make progress today.
            </Text>
          </View>

          {/* ================= PROGRESS CARD ================= */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressLabel}>
                  Today's Progress
                </Text>

                <Text style={styles.progressNumber}>
                  0%
                </Text>
              </View>

              <View style={styles.progressCircle}>
                <Text style={styles.progressCircleText}>
                  0%
                </Text>
              </View>
            </View>

            <View style={styles.progressBarBackground}>
              <View style={styles.progressBar} />
            </View>

            <Text style={styles.progressFooter}>
              Start a study session to begin tracking your progress.
            </Text>
          </View>

          {/* ================= STATISTICS ================= */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>⏱</Text>
              </View>

              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Study Hours</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>✓</Text>
              </View>

              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>

          {/* ================= CONTINUE STUDYING ================= */}
          <Text style={styles.sectionTitle}>
            Continue Studying
          </Text>

          <Pressable
            style={styles.sessionCard}
            onPress={() => router.push("/tabs/sessions")}
          >
            <View style={styles.sessionIcon}>
              <Text style={styles.sessionIconText}>▶</Text>
            </View>

            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>
                Start a Study Session
              </Text>

              <Text style={styles.sessionSubtitle}>
                Choose a subject and start learning
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>

          {/* ================= QUICK ACTIONS ================= */}
          <Text style={styles.sectionTitle}>
            Quick Access
          </Text>

          <View style={styles.quickGrid}>

            {/* Subjects */}
            <Pressable
              style={styles.quickCard}
              onPress={() => router.push("/tabs/subjects")}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>📚</Text>
              </View>

              <Text style={styles.quickTitle}>
                Subjects
              </Text>

              <Text style={styles.quickSubtitle}>
                Manage subjects
              </Text>
            </Pressable>

            {/* Sessions */}
            <Pressable
              style={styles.quickCard}
              onPress={() => router.push("/tabs/sessions")}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>⏱</Text>
              </View>

              <Text style={styles.quickTitle}>
                Sessions
              </Text>

              <Text style={styles.quickSubtitle}>
                Track your study
              </Text>
            </Pressable>

            {/* Statistics */}
            <Pressable
              style={styles.quickCard}
              onPress={() => router.push("/tabs/statistics")}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>📊</Text>
              </View>

              <Text style={styles.quickTitle}>
                Statistics
              </Text>

              <Text style={styles.quickSubtitle}>
                View your progress
              </Text>
            </Pressable>

            {/* AI */}
            <Pressable
              style={styles.quickCard}
              onPress={() => router.push("/ai")}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>🤖</Text>
              </View>

              <Text style={styles.quickTitle}>
                AI Assistant
              </Text>

              <Text style={styles.quickSubtitle}>
                Get study help
              </Text>
            </Pressable>

          </View>

          {/* ================= BOTTOM SPACE ================= */}
          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* ================= BOTTOM NAVIGATION ================= */}
        <View style={styles.bottomNav}>

          <Pressable style={styles.navItem}>
            <Text style={[styles.navIcon, styles.activeNavIcon]}>
              🏠
            </Text>

            <Text style={[styles.navText, styles.activeNavText]}>
              Home
            </Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/tabs/subjects")}
          >
            <Text style={styles.navIcon}>📚</Text>
            <Text style={styles.navText}>Subjects</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/tabs/sessions")}
          >
            <Text style={styles.navIcon}>⏱</Text>
            <Text style={styles.navText}>Sessions</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/tabs/statistics")}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navText}>Stats</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/tabs/profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </Pressable>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ================= SCREEN =================

  screen: {
    flex: 1,
    backgroundColor: "#EEF1F6",
  },

  appContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "#F8F9FC",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  // ================= HEADER =================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 14,
    color: "#7B8190",
    marginBottom: 3,
  },

  userName: {
    fontSize: 25,
    fontWeight: "800",
    color: "#151923",
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#151923",
    justifyContent: "center",
    alignItems: "center",
  },

  profileLetter: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  // ================= WELCOME =================

  welcomeSection: {
    marginBottom: 20,
  },

  welcomeTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#151923",
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: "#7B8190",
    marginTop: 5,
    lineHeight: 20,
  },

  // ================= PROGRESS =================

  progressCard: {
    backgroundColor: "#151923",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressLabel: {
    color: "#B8BDC8",
    fontSize: 13,
    fontWeight: "600",
  },

  progressNumber: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 5,
  },

  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: "#555B68",
    justifyContent: "center",
    alignItems: "center",
  },

  progressCircleText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  progressBarBackground: {
    height: 7,
    backgroundColor: "#343944",
    borderRadius: 10,
    marginTop: 18,
    overflow: "hidden",
  },

  progressBar: {
    width: "0%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  progressFooter: {
    color: "#9EA4B1",
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },

  // ================= STATS =================

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0F1F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statIcon: {
    fontSize: 17,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "800",
    color: "#151923",
  },

  statLabel: {
    fontSize: 12,
    color: "#7B8190",
    marginTop: 3,
  },

  // ================= SECTION =================

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#151923",
    marginTop: 25,
    marginBottom: 12,
  },

  // ================= SESSION =================

  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#151923",
    justifyContent: "center",
    alignItems: "center",
  },

  sessionIconText: {
    color: "#FFFFFF",
    fontSize: 17,
  },

  sessionInfo: {
    flex: 1,
    marginLeft: 14,
  },

  sessionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#151923",
  },

  sessionSubtitle: {
    fontSize: 12,
    color: "#7B8190",
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: "#A0A5AF",
    marginLeft: 8,
  },

  // ================= QUICK ACTIONS =================

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },

  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F0F1F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  quickIconText: {
    fontSize: 20,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#151923",
  },

  quickSubtitle: {
    fontSize: 11,
    color: "#858B98",
    marginTop: 4,
  },

  // ================= BOTTOM =================

  bottomSpace: {
    height: 20,
  },

  bottomNav: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EAF0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 18,
    marginBottom: 4,
    opacity: 0.55,
  },

  activeNavIcon: {
    opacity: 1,
  },

  navText: {
    fontSize: 10,
    color: "#8A909C",
    fontWeight: "500",
  },

  activeNavText: {
    color: "#151923",
    fontWeight: "700",
  },
});