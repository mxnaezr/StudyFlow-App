import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { sendAIMessage } from "../../services/aiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AI() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I'm your StudyFlow AI Assistant. How can I help you study today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const text = userMessage.trim();

    if (!text || loading) {
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };

    setMessages((current: Message[]) => [
      ...current,
      userMsg,
    ]);

    setUserMessage("");
    setLoading(true);

    try {
      const aiResponse = await sendAIMessage(text);

      const aiMsg: Message = {
        id: `${Date.now()}-ai`,
        sender: "ai",
        text: aiResponse || "I couldn't generate a response.",
      };

      setMessages((current: Message[]) => [
        ...current,
        aiMsg,
      ]);

    } catch (error) {
      console.error("AI error:", error);

      setMessages((current: Message[]) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          sender: "ai",
          text: "Sorry, I couldn't connect to the AI assistant.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.replace("/tabs" as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>

        <Pressable
          style={styles.backButton}
          onPress={goBack}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#171827"
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            STUDYFLOW
          </Text>

          <Text style={styles.title}>
            AI Assistant
          </Text>

          <Text style={styles.subtitle}>
            Your personal study companion
          </Text>
        </View>

        <View style={styles.aiIcon}>
          <Ionicons
            name="sparkles"
            size={22}
            color="#6C63FF"
          />
        </View>

      </View>

      {/* MESSAGES */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.sender === "user"
                ? styles.userRow
                : styles.aiRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === "user"
                  ? styles.userBubble
                  : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === "user"
                    ? styles.userText
                    : styles.aiText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.aiRow}>
            <View style={styles.aiBubble}>
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  size="small"
                  color="#6C63FF"
                />

                <Text style={styles.loadingText}>
                  Thinking...
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputContainer}>

        <TextInput
          value={userMessage}
          onChangeText={setUserMessage}
          placeholder="Ask your AI assistant..."
          placeholderTextColor="#9AA0AE"
          multiline
          style={styles.input}
          editable={!loading}
          onSubmitEditing={handleSend}
        />

        <Pressable
          style={[
            styles.sendButton,
            (!userMessage.trim() || loading) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!userMessage.trim() || loading}
        >
          <Ionicons
            name="arrow-up"
            size={23}
            color="#FFFFFF"
          />
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E6EE",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6C63FF",
    letterSpacing: 0.8,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#171827",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 12,
    color: "#77798A",
    marginTop: 2,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#ECEBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    padding: 18,
    paddingBottom: 30,
  },

  messageRow: {
    width: "100%",
    marginBottom: 14,
  },

  aiRow: {
    alignItems: "flex-start",
  },

  userRow: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 16,
  },

  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderTopLeftRadius: 5,
  },

  userBubble: {
    backgroundColor: "#6C63FF",
    borderTopRightRadius: 5,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },

  aiText: {
    color: "#252536",
  },

  userText: {
    color: "#FFFFFF",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  loadingText: {
    color: "#77798A",
    fontSize: 13,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E6EE",
    gap: 9,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: "#F7F8FC",
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#171827",
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },
});