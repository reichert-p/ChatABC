const input = document.getElementById("input");
const messages = document.getElementById("messages");
let clientId;
let partnerId;
let chatChannel;
const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});
const ws = new WebSocket("ws://localhost:3000");
input.addEventListener("keydown", handleInputKeydown);

peerConnection.onicecandidate = handleIceCandidate;
peerConnection.ondatachannel = handleDataChannel;
ws.onmessage = handleWebSocketMessage;

function handleInputKeydown(event) {
  if (event.key !== "Enter" || !input.value || !chatChannel) {
    return;
  }
  const message = event.target.value;
  sendMessage(message);
  displayMessage({ name: `${clientId} (YOU)`, text: message });
  input.value = "";
}

function sendMessage(text) {
  chatChannel.send(JSON.stringify({ name: clientId, text }));
}

function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = `${message.name}: ${message.text}`;
  messages.appendChild(div);
}

function initiateCall() {
  createDataChannel();
  createAndSendOffer();
}

function createDataChannel() {
  chatChannel = peerConnection.createDataChannel("chat");
  chatChannel.onopen = handleDataChannelOpen;
  chatChannel.onmessage = handleDataChannelMessage;
  chatChannel.onclose = handleDataChannelClose;
}

function createAndSendOffer() {
  peerConnection.createOffer().then((offer) => {
    peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", offer }));
  });
}

function handleIceCandidate(event) {
  if (event.candidate) {
    ws.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
  }
}

function handleDataChannel(event) {
  if (event.channel?.label === "chat") {
    chatChannel = event.channel;
    chatChannel.onopen = handleDataChannelOpen;
    chatChannel.onmessage = handleDataChannelMessage;
    chatChannel.onclose = handleDataChannelClose;
  }
}

function handleWebSocketMessage(event) {
  const message = JSON.parse(event.data);
  const handlers = {
    id: () => (clientId = message.value),
    partner: () => (partnerId = message.value),
    initiate: initiateCall,
    offer: () => handleReceivedOffer(message),
    candidate: () => handleReceivedCandidate(message),
    answer: () => handleReceivedAnswer(message),
  };
  handlers[message.type]?.();
}

function handleReceivedOffer(message) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
  peerConnection.createAnswer().then((answer) => {
    peerConnection.setLocalDescription(answer);
    ws.send(JSON.stringify({ type: "answer", answer }));
  });
}

function handleReceivedCandidate(message) {
  const candidate = new RTCIceCandidate(message.candidate);
  peerConnection.addIceCandidate(candidate);
}

function handleReceivedAnswer(message) {
  peerConnection.setRemoteDescription(
    new RTCSessionDescription(message.answer)
  );
}

function handleDataChannelOpen() {
  input.disabled = false;
  input.placeholder = "Type your message...";
}

function handleDataChannelMessage(event) {
  const message = JSON.parse(event.data);
  displayMessage(message);
}

function handleDataChannelClose() {
  input.disabled = true;
  input.placeholder = "Chat is closed";
}
