import { StyleSheet, Text, View } from "react-native";

export default function Subjects() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subjects</Text>
      <Text style={styles.subtitle}>Your subjects will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },
});
