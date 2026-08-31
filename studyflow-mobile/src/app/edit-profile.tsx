import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
    Gender,
    getCurrentUser,
    getProfileImage,
    saveProfileImage,
    updateProfile,
} from "../services/authService";

import {
    COLORS,
    RADIUS,
    SPACING,
} from "../constants/theme";

export default function EditProfileScreen() {
    // ============================================================
    // STATE
    // ============================================================

    const [name, setName] = useState("");

    const [gender, setGender] = useState<Gender>("");

    const [dateOfBirth, setDateOfBirth] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");

    const [profileImage, setProfileImage] =
        useState<string | null>(null);

    const [saving, setSaving] = useState(false);

    const [showSavedMessage, setShowSavedMessage] =
        useState(false);

    // ============================================================
    // LOAD PROFILE
    // ============================================================

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = await getCurrentUser();

            const image = await getProfileImage();

            if (user) {
                setName(user.name || "");

                setGender(user.gender || "");

                setDateOfBirth(user.dateOfBirth || "");

                setPhoneNumber(user.phoneNumber || "");

                if (user.profileImage) {
                    setProfileImage(user.profileImage);
                }
            }

            if (image) {
                setProfileImage(image);
            }
        } catch (error) {
            console.error(
                "Failed to load profile:",
                error
            );
        }
    };

    // ============================================================
    // CHANGE PROFILE PICTURE
    // ============================================================

    const changeProfilePicture = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Permission required",
                    "Please allow StudyFlow to access your photos."
                );

                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });

            if (!result.canceled) {
                const selectedImage =
                    result.assets[0].uri;

                setProfileImage(selectedImage);

                await saveProfileImage(selectedImage);
            }
        } catch (error) {
            console.error(
                "Profile picture error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to change your profile picture."
            );
        }
    };

    // ============================================================
    // SELECT GENDER
    // ============================================================

    const selectGender = (
        selectedGender: Gender
    ) => {
        setGender(selectedGender);
    };

    // ============================================================
    // SAVE PROFILE
    // ============================================================

    const saveProfile = async () => {
        // Prevent multiple clicks
        if (saving) {
            return;
        }

        // Validate name
        if (!name.trim()) {
            Alert.alert(
                "Invalid Name",
                "Please enter your name."
            );

            return;
        }

        // Validate date of birth
        if (!dateOfBirth.trim()) {
            Alert.alert(
                "Date of Birth Required",
                "Please enter your date of birth."
            );

            return;
        }

        // Validate phone number
        if (!phoneNumber.trim()) {
            Alert.alert(
                "Phone Number Required",
                "Please enter your phone number."
            );

            return;
        }

        try {
            setSaving(true);

            // ========================================================
            // UPDATE PROFILE
            // ========================================================

            await updateProfile({
                name: name.trim(),

                gender,

                dateOfBirth: dateOfBirth.trim(),

                phoneNumber: phoneNumber.trim(),

                profileImage: profileImage ?? "",
            });

            // ========================================================
            // SHOW SMALL SUCCESS MESSAGE
            // ========================================================

            setShowSavedMessage(true);

            // Hide message after 2 seconds
            setTimeout(() => {
                setShowSavedMessage(false);
            }, 2000);

        } catch (error) {
            console.error(
                "Save profile error:",
                error
            );

            Alert.alert(
                "Error",
                "Unable to save your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <View style={styles.container}>

            {/* ======================================================
          HEADER
      ====================================================== */}

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.replace("/tabs/profile")}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButton}>
                        ‹
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Edit Profile
                </Text>

                {/* Keeps title centered */}
                <View style={{ width: 30 }} />

            </View>


            {/* ======================================================
          PROFILE PICTURE
      ====================================================== */}

            <View style={styles.pictureSection}>

                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={changeProfilePicture}
                    activeOpacity={0.8}
                >

                    {profileImage ? (

                        <Image
                            source={{
                                uri: profileImage,
                            }}
                            style={styles.avatarImage}
                        />

                    ) : (

                        <View
                            style={styles.avatarPlaceholder}
                        >

                            <Text style={styles.avatarText}>
                                {name
                                    ? name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "?"}
                            </Text>

                        </View>

                    )}

                </TouchableOpacity>


                <TouchableOpacity
                    onPress={changeProfilePicture}
                    activeOpacity={0.7}
                >

                    <Text style={styles.changePhoto}>
                        Change Profile Picture
                    </Text>

                </TouchableOpacity>


                <Text style={styles.photoHint}>
                    Choose a picture from your device
                </Text>

            </View>


            {/* ======================================================
          FORM
      ====================================================== */}

            <View style={styles.form}>

                {/* ====================================================
            NAME
        ==================================================== */}

                <Text style={styles.label}>
                    Name
                </Text>

                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor={
                        COLORS.textMuted
                    }
                    style={styles.input}
                />


                {/* ====================================================
            GENDER
        ==================================================== */}

                <Text style={styles.label}>
                    Gender
                </Text>

                <View style={styles.genderContainer}>

                    {/* FEMALE */}

                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === "Female" &&
                            styles.genderButtonSelected,
                        ]}
                        onPress={() =>
                            selectGender("Female")
                        }
                        activeOpacity={0.8}
                    >

                        <Text
                            style={[
                                styles.genderText,
                                gender === "Female" &&
                                styles.genderTextSelected,
                            ]}
                        >
                            Female
                        </Text>

                    </TouchableOpacity>


                    {/* MALE */}

                    <TouchableOpacity
                        style={[
                            styles.genderButton,
                            gender === "Male" &&
                            styles.genderButtonSelected,
                        ]}
                        onPress={() =>
                            selectGender("Male")
                        }
                        activeOpacity={0.8}
                    >

                        <Text
                            style={[
                                styles.genderText,
                                gender === "Male" &&
                                styles.genderTextSelected,
                            ]}
                        >
                            Male
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* ====================================================
            DATE OF BIRTH
        ==================================================== */}

                <Text style={styles.label}>
                    Date of Birth
                </Text>

                <TextInput
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={
                        COLORS.textMuted
                    }
                    style={styles.input}
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                />


                {/* ====================================================
            PHONE NUMBER
        ==================================================== */}

                <Text style={styles.label}>
                    Phone Number
                </Text>

                <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    placeholderTextColor={
                        COLORS.textMuted
                    }
                    style={styles.input}
                    keyboardType="phone-pad"
                />


                {/* ====================================================
            SAVE BUTTON
        ==================================================== */}

                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        saving &&
                        styles.saveButtonDisabled,
                    ]}
                    onPress={saveProfile}
                    disabled={saving}
                    activeOpacity={0.8}
                >

                    <Text style={styles.saveButtonText}>

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </Text>

                </TouchableOpacity>

            </View>


            {/* ======================================================
          SMALL SUCCESS MESSAGE
      ====================================================== */}

            {showSavedMessage && (

                <View style={styles.savedMessage}>

                    <Text style={styles.savedMessageText}>
                        ✓ Changes saved
                    </Text>

                </View>

            )}

        </View>
    );
}


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.xl,
    },


    // ==========================================================
    // HEADER
    // ==========================================================

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: SPACING.xl,
    },

    backButton: {
        fontSize: 36,
        color: COLORS.primary,
        fontWeight: "300",
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.text,
    },


    // ==========================================================
    // PROFILE PICTURE
    // ==========================================================

    pictureSection: {
        alignItems: "center",
        marginBottom: SPACING.xl,
    },

    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        overflow: "hidden",
        marginBottom: SPACING.md,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
    },

    avatarPlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 44,
        fontWeight: "800",
        color: "#FFFFFF",
    },

    changePhoto: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.primary,
    },

    photoHint: {
        marginTop: 5,
        fontSize: 12,
        color: COLORS.textMuted,
    },


    // ==========================================================
    // FORM
    // ==========================================================

    form: {
        width: "100%",
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.md,
        fontSize: 15,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },


    // ==========================================================
    // GENDER
    // ==========================================================

    genderContainer: {
        flexDirection: "row",
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },

    genderButton: {
        flex: 1,
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    genderButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    genderText: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text,
    },

    genderTextSelected: {
        color: "#FFFFFF",
    },


    // ==========================================================
    // SAVE BUTTON
    // ==========================================================

    saveButton: {
        height: 52,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginTop: SPACING.sm,
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        fontSize: 15,
        fontWeight: "800",
        color: "#FFFFFF",
    },


    // ==========================================================
    // SUCCESS MESSAGE
    // ==========================================================

    savedMessage: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,

        backgroundColor: COLORS.surface,

        borderWidth: 1,
        borderColor: COLORS.primary,

        borderRadius: RADIUS.md,

        paddingVertical: 12,
        paddingHorizontal: 16,

        alignItems: "center",

        elevation: 5,

        shadowOpacity: 0.15,
        shadowRadius: 6,

        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    savedMessageText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },

});