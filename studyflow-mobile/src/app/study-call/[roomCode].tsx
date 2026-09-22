import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AudioSession,
  LiveKitRoom,
  registerGlobals,
} from "@livekit/react-native";

import { endStudyCall, startStudyCall, StudyCallToken } from "../../services/studyCallService";

registerGlobals();

export default function StudyCallScreen() {
  const { roomCode } = useLocalSearchParams<{ roomCode?: string }>();
  const code = String(roomCode ?? "");
  const [call, setCall] = useState<StudyCallToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const begin = async () => {
      try {
        await AudioSession.startAudioSession();
        const token = await startStudyCall(code);
        if (mounted) setCall(token);
      } catch (error: any) {
        Alert.alert(
          "Unable to start call",
          error?.message || "Please check your LiveKit configuration and try again.",
          [{ text: "Back", onPress: () => router.back() }]
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    begin();

    return () => {
      mounted = false;
      AudioSession.stopAudioSession();
    };
  }, [code]);

  const leaveCall = async () => {
    if (ending) return;
    setEnding(true);

    try {
      if (call?.logId) {
        await endStudyCall(call.logId);
      }
    } catch (error) {
      console.warn("Could not update call log:", error);
    } finally {
      router.back();
    }
  };

  if (loading || !call) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Starting your study call...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LiveKitRoom
        serverUrl={call.serverUrl}
        token={call.participantToken}
        connect={true}
        audio={true}
        video={false}
        options={{ adaptiveStream: { pixelDensity: "screen" } }}
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.warn("LiveKit error:", error)}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>STUDYFLOW CALL</Text>
              <Text style={styles.title}>Study together</Text>
              <Text style={styles.room}>Room {code}</Text>
            </View>
            <View style={[styles.status, connected && styles.statusLive]}>
              <View style={[styles.statusDot, connected && styles.statusDotLive]} />
              <Text style={styles.statusText}>{connected ? "Live" : "Connecting"}</Text>
            </View>
          </View>

          <View style={styles.callCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <Text style={styles.callTitle}>Group study call</Text>
            <Text style={styles.callSubtitle}>
              Your microphone is on. Keep this room open while you study with your group.
            </Text>
          </View>

          <View style={styles.controls}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>AUDIO</Text>
              <Text style={styles.controlValue}>Microphone enabled</Text>
            </View>

            <Pressable
              style={[styles.leaveButton, ending && styles.disabled]}
              onPress={leaveCall}
              disabled={ending}
            >
              <Text style={styles.leaveButtonText}>{ending ? "Leaving..." : "Leave Call"}</Text>
            </Pressable>
          </View>
        </View>
      </LiveKitRoom>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#11121C" },
  loadingScreen: { flex: 1, backgroundColor: "#11121C", alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#FFFFFF", marginTop: 12, fontSize: 14 },
  content: { flex: 1, width: "100%", maxWidth: 760, alignSelf: "center", padding: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  eyebrow: { color: "#8B8DFF", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title: { color: "#FFFFFF", fontSize: 27, fontWeight: "800", marginTop: 3 },
  room: { color: "#A9ABB9", fontSize: 12, marginTop: 4 },
  status: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, backgroundColor: "#242532" },
  statusLive: { backgroundColor: "#183226" },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#888A99" },
  statusDotLive: { backgroundColor: "#49D17D" },
  statusText: { color: "#D8D9E1", fontSize: 10, fontWeight: "800" },
  callCard: { flex: 1, minHeight: 380, borderRadius: 24, backgroundColor: "#1A1B27", alignItems: "center", justifyContent: "center", padding: 30, borderWidth: 1, borderColor: "#292B3A" },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#4F46E5", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  avatarText: { color: "#FFFFFF", fontSize: 38, fontWeight: "800" },
  callTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "800" },
  callSubtitle: { color: "#A9ABB9", fontSize: 13, lineHeight: 19, textAlign: "center", maxWidth: 380, marginTop: 8 },
  controls: { flexDirection: "row", alignItems: "center", marginTop: 18, gap: 12 },
  controlInfo: { flex: 1, backgroundColor: "#1A1B27", borderRadius: 15, padding: 14, borderWidth: 1, borderColor: "#292B3A" },
  controlLabel: { color: "#858797", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  controlValue: { color: "#FFFFFF", fontSize: 12, fontWeight: "700", marginTop: 4 },
  leaveButton: { backgroundColor: "#EF4444", borderRadius: 15, paddingHorizontal: 20, minHeight: 52, alignItems: "center", justifyContent: "center" },
  leaveButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  disabled: { opacity: 0.6 },
});
