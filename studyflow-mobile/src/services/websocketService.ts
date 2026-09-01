import { Client, IMessage } from "@stomp/stompjs";

export interface StudyRoomMessage {
  roomCode: string;
  sender: string;
  message: string;
}

let stompClient: Client | null = null;
let roomSubscription: { unsubscribe: () => void } | null = null;

const WS_URL = "ws://192.168.8.200:8080/ws";

export function connectToStudyRoom(
  roomCode: string,
  onMessageReceived: (message: StudyRoomMessage) => void,
  onConnected?: () => void,
  onDisconnected?: () => void
) {
  if (!roomCode || !roomCode.trim()) {
    console.error("Room code is required.");
    return;
  }

  const normalizedRoomCode = roomCode.trim();

  // Disconnect any previous room connection
  disconnectFromStudyRoom();

  stompClient = new Client({
    brokerURL: WS_URL,

    reconnectDelay: 5000,

    debug: (str) => {
      console.log("[STOMP]", str);
    },

    onConnect: () => {
      console.log("=================================");
      console.log("WEBSOCKET CONNECTED");
      console.log("ROOM:", normalizedRoomCode);
      console.log("=================================");

      roomSubscription = stompClient?.subscribe(
        `/topic/room/${normalizedRoomCode}`,
        (frame: IMessage) => {
          try {
            const data = JSON.parse(frame.body) as StudyRoomMessage;

            console.log("ROOM MESSAGE RECEIVED:", data);

            if (data.roomCode === normalizedRoomCode) {
              onMessageReceived(data);
            }
          } catch (error) {
            console.error(
              "Failed to parse WebSocket message:",
              error
            );
          }
        }
      ) ?? null;

      onConnected?.();
    },

    onStompError: (frame) => {
      console.error(
        "STOMP ERROR:",
        frame.headers["message"]
      );

      console.error(
        "Details:",
        frame.body
      );
    },

    onWebSocketError: (error) => {
      console.error(
        "WEBSOCKET ERROR:",
        error
      );

      onDisconnected?.();
    },

    onWebSocketClose: () => {
      console.log("WEBSOCKET DISCONNECTED");

      onDisconnected?.();
    },
  });

  stompClient.activate();
}

export function sendStudyRoomMessage(
  roomCode: string,
  sender: string,
  message: string
) {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket is not connected.");
    return false;
  }

  const payload: StudyRoomMessage = {
    roomCode: roomCode.trim(),
    sender,
    message,
  };

  console.log("=================================");
  console.log("SENDING ROOM MESSAGE");
  console.log(payload);
  console.log("=================================");

  stompClient.publish({
    destination: "/app/room/message",
    body: JSON.stringify(payload),
  });

  return true;
}

export function disconnectFromStudyRoom() {
  if (roomSubscription) {
    roomSubscription.unsubscribe();
    roomSubscription = null;
  }

  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}