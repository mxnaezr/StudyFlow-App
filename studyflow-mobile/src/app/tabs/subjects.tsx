import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
  Subject,
} from "../../services/subjectService";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6C63FF");

  // ============================================================
  // LOAD SUBJECTS
  // ============================================================

  const loadSubjects = useCallback(async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects:", error);

      Alert.alert(
        "Unable to load subjects",
        "Could not connect to the StudyFlow server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // ============================================================
  // REFRESH
  // ============================================================

  const onRefresh = () => {
    setRefreshing(true);
    loadSubjects();
  };

  // ============================================================
  // OPEN CREATE FORM
  // ============================================================

  const openCreateForm = () => {
    setEditingSubject(null);
    setName("");
    setDescription("");
    setColor("#6C63FF");
    setShowForm(true);
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const openEditForm = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setDescription(subject.description ?? "");
    setColor(subject.color ?? "#6C63FF");
    setShowForm(true);
  };

  // ============================================================
  // SAVE SUBJECT
  // ============================================================

  const saveSubject = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      Alert.alert("Subject name required", "Please enter a subject name.");
      return;
    }

    try {
      if (editingSubject) {
        // UPDATE
        const updated = await updateSubject(editingSubject.id, {
          name: trimmedName,
          description: trimmedDescription,
          color,
        });

        setSubjects((current) =>
          current.map((subject) =>
            subject.id === editingSubject.id ? updated : subject
          )
        );

        Alert.alert("Subject updated", "Your subject has been updated.");
      } else {
        // CREATE
        const created = await createSubject({
          name: trimmedName,
          description: trimmedDescription,
          color,
        });

        setSubjects((current) => [...current, created]);

        Alert.alert("Subject created", "Your new subject has been added.");
      }

      setShowForm(false);
      setEditingSubject(null);
      setName("");
      setDescription("");
      setColor("#6C63FF");
    } catch (error) {
      console.error("Failed to save subject:", error);

      Alert.alert(
        "Something went wrong",
        "The subject could not be saved."
      );
    }
  };

  // ============================================================
  // DELETE SUBJECT
  // ============================================================

  const confirmDelete = (subject: Subject) => {
    Alert.alert(
      "Delete subject?",
      `Are you sure you want to delete "${subject.name}"?`,
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
              await deleteSubject(subject.id);

              setSubjects((current) =>
                current.filter((item) => item.id !== subject.id)
              );
            } catch (error) {
              console.error("Failed to delete subject:", error);

              Alert.alert(
                "Delete failed",
                "The subject could not be deleted."
              );
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading subjects...</Text>
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
            <Text style={styles.eyebrow}>Stay organised</Text>

            <Text style={styles.title}>Subjects</Text>

            <Text style={styles.subtitle}>
              Manage the subjects you are studying.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>📚</Text>
          </View>
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>📖</Text>
          </View>

          <View style={styles.summaryText}>
            <Text style={styles.summaryNumber}>{subjects.length}</Text>

            <Text style={styles.summaryLabel}>
              {subjects.length === 1 ? "Subject" : "Subjects"}
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={openCreateForm}
          >
            <Text style={styles.addButtonText}>＋ Add</Text>
          </Pressable>
        </View>

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingSubject ? "Edit Subject" : "New Subject"}
              </Text>

              <Pressable onPress={() => setShowForm(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Subject name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Software Engineering"
              placeholderTextColor="#9AA0AE"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Description</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="What are you studying?"
              placeholderTextColor="#9AA0AE"
              multiline
              style={[styles.input, styles.descriptionInput]}
            />

            <Text style={styles.inputLabel}>Colour</Text>

            <View style={styles.colorsRow}>
              {[
                "#6C63FF",
                "#4F8EF7",
                "#35B86B",
                "#F59E0B",
                "#EF5B7A",
                "#8B5CF6",
              ].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setColor(item)}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: item,
                    },
                    color === item && styles.selectedColor,
                  ]}
                >
                  {color === item && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.formActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={saveSubject}
              >
                <Text style={styles.saveButtonText}>
                  {editingSubject ? "Update" : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* SUBJECT LIST */}

        <Text style={styles.sectionTitle}>Your Subjects</Text>

        {subjects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📚</Text>

            <Text style={styles.emptyTitle}>
              No subjects yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Add your first subject to start organising your studies.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={openCreateForm}
            >
              <Text style={styles.emptyButtonText}>
                ＋ Add Subject
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.subjectsCard}>
            {subjects.map((subject, index) => {
              const subjectColor = subject.color || "#6C63FF";

              return (
                <View key={subject.id}>
                  <View style={styles.subjectRow}>
                    {/* COLOUR ICON */}

                    <View
                      style={[
                        styles.subjectIcon,
                        {
                          backgroundColor: `${subjectColor}18`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subjectIconText,
                          {
                            color: subjectColor,
                          },
                        ]}
                      >
                        {subject.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    {/* INFORMATION */}

                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>
                        {subject.name}
                      </Text>

                      <Text style={styles.subjectDescription}>
                        {subject.description || "No description"}
                      </Text>
                    </View>

                    {/* ACTIONS */}

                    <View style={styles.subjectActions}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() => openEditForm(subject)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </Pressable>

                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => confirmDelete(subject)}
                      >
                        <Text style={styles.deleteButtonText}>×</Text>
                      </Pressable>
                    </View>
                  </View>

                  {index < subjects.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              );
            })}
          </View>
        )}
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
    fontSize: 14,
    color: "#77798A",
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

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171827",
    borderRadius: 20,
    padding: 18,
    marginBottom: 26,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#292A3B",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryIconText: {
    fontSize: 22,
  },

  summaryText: {
    flex: 1,
    marginLeft: 14,
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  summaryLabel: {
    color: "#B8BBC7",
    fontSize: 12,
    marginTop: 2,
  },

  addButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    padding: 17,
    marginBottom: 25,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#171827",
  },

  closeButton: {
    fontSize: 18,
    color: "#8B8FA3",
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444654",
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#171827",
    backgroundColor: "#F9FAFC",
  },

  descriptionInput: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  colorsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
    marginBottom: 15,
  },

  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedColor: {
    borderWidth: 3,
    borderColor: "#171827",
  },

  colorCheck: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  formActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 5,
  },

  cancelButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E1E9",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#555868",
    fontSize: 13,
    fontWeight: "700",
  },

  saveButton: {
    flex: 1,
    height: 44,
    backgroundColor: "#6C63FF",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171827",
    marginBottom: 11,
    marginTop: 3,
  },

  subjectsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E6EE",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  subjectIconText: {
    fontSize: 17,
    fontWeight: "800",
  },

  subjectInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  subjectName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#171827",
  },

  subjectDescription: {
    fontSize: 11,
    color: "#77798A",
    marginTop: 3,
  },

  subjectActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  editButton: {
    borderWidth: 1,
    borderColor: "#D9D7FF",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  editButtonText: {
    color: "#5D55E7",
    fontSize: 11,
    fontWeight: "800",
  },

  deleteButton: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#FFF0F2",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#D9435F",
    fontSize: 19,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECF2",
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
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#171827",
  },

  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#77798A",
    textAlign: "center",
    marginTop: 5,
    maxWidth: 300,
  },

  emptyButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 11,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});