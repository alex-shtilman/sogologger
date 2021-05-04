import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class SogoLogger {
  constructor(loggerUrl, clientId, nodePlayer) {
    this.loggerUrl = loggerUrl;
    this.clientId = clientId;
    this.nodePlayer = nodePlayer;
    this.stompClient = null;
    this.socket = null;
  }
  connect() {
    this.socket = new SockJS(this.loggerUrl);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, function (frame) {
      console.info("Connected: " + frame);
      this.stompClient.send("/app/connections", {}, JSON.stringify(frame));
    });
    this.nodePlayer.on("stats", (s) => {
      s["clientId"] = this.clientId;
      this.stompClient.send("/app/stats", {}, JSON.stringify(s));
    });
  }
  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.info("Disconnected");
  }
}

export default SogoLogger;
