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
  onMessageReceived: (message: StudyRoomMessage) => void,
  roomCode: string,
  onConnected?: () => void,
  onDisconnected?: () => void
) {
  disconnectFromStudyRoom();

  stompClient = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    debug: (str) => console.log("[STOMP]", str),

    onConnect: () => {
      console.log("=================================");
      console.log("WEBSOCKET CONNECTED");
      console.log("ROOM:", roomCode);
      console.log("=================================");

      // Each room gets its own topic. This prevents messages from
      // one study room appearing in another room.
      roomSubscription = stompClient?.subscribe(
        `/topic/room/${encodeURIComponent(roomCode)}`,
        (frame: IMessage) => {
          try {
            const data = JSON.parse(frame.body) as StudyRoomMessage;
            if (data.roomCode === roomCode) onMessageReceived(data);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        }
      ) ?? null;

      onConnected?.();
    },

    onStompError: (frame) => {
      console.error("STOMP ERROR:", frame.headers["message"]);
      console.error("Details:", frame.body);
    },

    onWebSocketError: (error) => {
      console.error("WEBSOCKET ERROR:", error);
      onDisconnected?.();
    },

    onWebSocketClose: () => {
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
    roomCode,
    sender,
    message,
  };

  stompClient.publish({
    destination: "/app/room/message",
    body: JSON.stringify(payload),
  });

  return true;
}

export function disconnectFromStudyRoom() {
  roomSubscription?.unsubscribe();
  roomSubscription = null;

  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}
