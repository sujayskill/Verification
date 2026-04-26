import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectSocket = (orgId, role, onMessage) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    console.log("✅ WebSocket Connected");

    // ✅ FIXED ROLE LOGIC
    if (role === "CLIENT" || role === "CLIENT_ADMIN") {
      stompClient.subscribe(`/topic/client/${orgId}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    }

    if (role === "VENDOR" || role === "VENDOR_ADMIN") {
      stompClient.subscribe(`/topic/vendor`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    }
  };

  stompClient.activate();
};