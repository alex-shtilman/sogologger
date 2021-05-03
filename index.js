import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class SogoLogger {
  constructor(loggerUrl, clientId, nodePlayer) {
    this.loggerUrl = loggerUrl;
    this.clientId = clientId;
    this.nodePlayer = nodePlayer;
  }
  init() {
    const socket = new SockJS(this.loggerUrl);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      console.log("Connected: " + frame);
    });
    this.nodePlayer.on("stats", (s) => {
      console.log(s);
      s["clientId"] = this.clientId;
      stompClient.send("/app/chat", {}, JSON.stringify(s));
    });
  }
}

export default SogoLogger;
