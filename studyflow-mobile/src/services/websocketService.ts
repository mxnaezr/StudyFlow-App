import { Client, IMessage } from "@stomp/stompjs";

export interface StudyRoomMessage {
  roomCode: string;
  sender: string;
  message: string;
}

let stompClient: Client | null = null;

const WS_URL = "ws://192.168.8.200:8080/ws";

export function connectToStudyRoom(
  onMessageReceived: (message: StudyRoomMessage) => void
) {
  stompClient = new Client({
    brokerURL: WS_URL,

    reconnectDelay: 5000,

    debug: (str) => {
      console.log("[STOMP]", str);
    },

    onConnect: () => {
      console.log("=================================");
      console.log("WEBSOCKET CONNECTED");
      console.log("=================================");

      stompClient?.subscribe(
        "/topic/room",
        (message: IMessage) => {

          try {
            const data: StudyRoomMessage =
              JSON.parse(message.body);

            console.log("ROOM MESSAGE:", data);

            onMessageReceived(data);

          } catch (error) {
            console.error(
              "Failed to parse WebSocket message:",
              error
            );
          }
        }
      );
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
    console.error(
      "WebSocket is not connected."
    );

    return;
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
}

export function disconnectFromStudyRoom() {
  if (stompClient) {
    stompClient.deactivate();

    stompClient = null;

    console.log(
      "WebSocket disconnected."
    );
  }
}