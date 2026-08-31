import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.8.200:8080";

const TOKEN_KEY = "studyflow_token";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    console.log("=================================");
    console.log("API REQUEST");
    console.log("URL:", `${API_BASE_URL}${endpoint}`);
    console.log("METHOD:", options.method || "GET");
    console.log("BODY:", options.body);
    console.log("TOKEN EXISTS:", !!token);
    console.log("=================================");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add JWT token
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Add any custom headers passed to apiRequest
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    const text = await response.text();

    console.log("=================================");
    console.log("API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("RAW RESPONSE:", text);
    console.log("=================================");

    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null) ||
        `Request failed with status ${response.status}`;

      console.error(
        "SERVER ERROR:",
        response.status,
        message
      );

      throw new Error(message);
    }

    return data;

  } catch (error: any) {

    console.error(
      "API ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "Unable to connect to the server"
    );
  }
}