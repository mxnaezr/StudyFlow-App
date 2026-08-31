import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiRequest } from "./api";

// ============================================================
// STORAGE KEYS
// ============================================================

const TOKEN_KEY = "studyflow_token";
const USER_KEY = "studyflow_user";
const PROFILE_IMAGE_KEY = "studyflow_profile_image";

// ============================================================
// TYPES
// ============================================================

export type Gender = "" | "Female" | "Male";

export interface UserData {
  id?: number;

  name: string;

  email: string;

  gender?: Gender;

  dateOfBirth?: string;

  phoneNumber?: string;

  profileImage?: string;

  emailVerified?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ============================================================
// LOGIN
// ============================================================

export async function loginUser(data: LoginData) {

  const response = await apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (response.token) {

    await AsyncStorage.setItem(
      TOKEN_KEY,
      response.token
    );
  }

  /*
   * Your current backend login response only returns:
   *
   * token
   * email
   *
   * Therefore, if your backend later returns a complete
   * user object, this will automatically save it.
   */

  if (response.user) {

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(response.user)
    );

  } else {

    // At minimum save the email
    const existingUser = await getCurrentUser();

    if (existingUser) {

      await saveCurrentUser({
        ...existingUser,
        email: response.email ?? existingUser.email,
      });

    } else {

      await saveCurrentUser({
        name: "",
        email: response.email ?? data.email,
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        profileImage: "",
      });
    }
  }

  return response;
}

// ============================================================
// REGISTER
// ============================================================

export async function registerUser(
  data: RegisterData
) {

  const response = await apiRequest(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response;
}

// ============================================================
// VERIFY EMAIL
// ============================================================

export async function verifyEmail(
  email: string,
  code: string
) {

  const response = await apiRequest(
    `/api/auth/verify?email=${encodeURIComponent(
      email
    )}&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
    }
  );

  return response;
}

// ============================================================
// GET TOKEN
// ============================================================

export async function getToken() {

  return await AsyncStorage.getItem(
    TOKEN_KEY
  );
}

// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser(): Promise<UserData | null> {

  const user =
    await AsyncStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(user) as UserData;

  } catch (error) {

    console.error(
      "Failed to parse stored user:",
      error
    );

    return null;
  }
}

// ============================================================
// SAVE CURRENT USER
// ============================================================

export async function saveCurrentUser(
  user: UserData
) {

  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

// ============================================================
// GET PROFILE IMAGE
// ============================================================

export async function getProfileImage() {

  return await AsyncStorage.getItem(
    PROFILE_IMAGE_KEY
  );
}

// ============================================================
// SAVE PROFILE IMAGE
// ============================================================

export async function saveProfileImage(
  imageUri: string
) {

  await AsyncStorage.setItem(
    PROFILE_IMAGE_KEY,
    imageUri
  );
}

// ============================================================
// UPDATE PROFILE
// ============================================================

export interface UpdateProfileData {
  name: string;
  gender: Gender;
  dateOfBirth: string;
  phoneNumber: string;
  profileImage: string;
}

export async function updateProfile(
  data: UpdateProfileData
) {
  const response = await apiRequest(
    "/api/users/profile",
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

  console.log(
    "PROFILE UPDATE RESPONSE:",
    response
  );

  if (response.user) {
    await saveCurrentUser(response.user);

    if (response.user.profileImage) {
      await saveProfileImage(
        response.user.profileImage
      );
    }
  }

  return response;
}

// ============================================================
// LOGOUT
// ============================================================

export async function logoutUser() {

  await AsyncStorage.removeItem(
    TOKEN_KEY
  );

  await AsyncStorage.removeItem(
    USER_KEY
  );

  await AsyncStorage.removeItem(
    PROFILE_IMAGE_KEY
  );
}