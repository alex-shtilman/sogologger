import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

module.exports = function SogoLogger({ loggerUrl, clientId, nodePlayer }) {
  const stompClient = null;
  const socket = new SockJS(loggerUrl);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log("Connected: " + frame);
  });
  nodePlayer.on("stats", (s) => {
    console.log(s);
    s["clientId"] = clientId;
    stompClient.send("/app/chat", {}, JSON.stringify(s));
  });
};
