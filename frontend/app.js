const inputField = document.getElementById("input");
const usernameInput = document.getElementById("username");
const requestButton = document.getElementById("request");
const disconnectButton = document.getElementById("disconnect");
const messages = document.getElementById("messages");
let clientId;
let partnerId;
let chatChannel;
let clients = [];
let peerConnection = getNewPeerConnection();
const ws = new WebSocket("ws://localhost:3000");
inputField.addEventListener("keydown", handleInputKeydown);
usernameInput.addEventListener("keydown", handleUsernameKeydown);
requestButton.addEventListener("click", handleRequestClick);
disconnectButton.addEventListener("click", handleDisconnectClick);

ws.onmessage = handleWebSocketMessage;

function handleInputKeydown(event) {
  if (event.key !== "Enter" || !inputField.value || !chatChannel) {
    return;
  }
  const message = event.target.value;
  sendMessage(message);
  displayMessage({ clientId: clientId, text: message });
  inputField.value = "";
}

function handleUsernameKeydown(event) {
  if (event.key !== "Enter" || !usernameInput.value) {
    return;
  }
  const message = event.target.value;
  updateUsername(message);
  usernameInput.value = "";
}

function handleRequestClick() {
  sendChatRequest();
}

function handleDisconnectClick() {
  disconnectButton.disabled = true;
  disconnectFromPeer();
}

function sendMessage(text) {
  chatChannel.send(JSON.stringify({ clientId: clientId, text }));
}

function displayMessage(message) {
  const div = document.createElement("div");
  const username = clients.find(
    (client) => client.id === message.clientId
  ).username;
  let senderInfo = "";
  if (message.clientId === clientId) {
    senderInfo = "You";
  } else {
    senderInfo = username;
    // senderInfo = `${username ?? ""} (${message.clientId})`;
  }
  div.textContent = `${senderInfo}: ${message.text}`;
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
    ws.send(
      JSON.stringify({
        type: "offer",
        value: { offer: offer, partnerId: partnerId },
      })
    );
  });
}

function handleIceCandidate(event) {
  if (event.candidate) {
    ws.send(
      JSON.stringify({
        type: "candidate",
        value: { candidate: event.candidate, partnerId: partnerId },
      })
    );
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
    id: () => (clientId = message.value.clientId),
    partner: () => (partnerId = message.value.partnerId),
    initiate: () => handleReceivedInitiate(message),
    offer: () => handleReceivedOffer(message),
    candidate: () => handleReceivedCandidate(message),
    answer: () => handleReceivedAnswer(message),
    available_clients: () => handleAvailableClients(message),
    chat_request: () => handleChatRequest(message),
    chat_request_rejected: () => handleChatRequestRejected(message),
  };
  handlers[message.type]?.();
}
function handleReceivedInitiate(message) {
  partnerId = message.value.partnerId;
  initiateCall();
}
function handleReceivedOffer(message) {
  peerConnection.setRemoteDescription(
    new RTCSessionDescription(message.value.offer)
  );
  peerConnection.createAnswer().then((answer) => {
    peerConnection.setLocalDescription(answer);
    ws.send(JSON.stringify({ type: "answer", value: { answer: answer } }));
  });
}

function handleReceivedCandidate(message) {
  const candidate = new RTCIceCandidate(message.value.candidate);
  peerConnection.addIceCandidate(candidate);
}

function handleReceivedAnswer(message) {
  peerConnection.setRemoteDescription(
    new RTCSessionDescription(message.value.answer)
  );
}

function handleAvailableClients(message) {
  const allAvailableClients = message.value.availableClients;
  clients = allAvailableClients;
}

function handleChatRequest(message) {
  const requestorId = message.value.requestorId;
  // check if user wants to chat with requestor
  respondToChatRequest(requestorId, true);
}

function handleChatRequestRejected(message) {
  const requestedChatPartnerId = message.value.requestedChatPartnerId;
  // check if user wants to chat with requestor
  alert(
    `Your chat request to ${requestedChatPartnerId} was rejected. Please try again.`
  );
}

function handleDataChannelOpen() {
  //inputField.disabled = false;
  inputField.placeholder = "Type a message";
  disconnectButton.disabled = false;
  disconnectButton.setAttribute("title", "Disconnect from chat partner");
  requestButton.disabled = true;
}

function handleDataChannelMessage(event) {
  const message = JSON.parse(event.data);
  displayMessage(message);
}

function handleDataChannelClose() {
  inputField.disabled = true;
  inputField.placeholder = "Chat is closed";
  disconnectButton.disabled = true;
  requestButton.disabled = false;
  disconnectButton.setAttribute("title", "No chat partner connected");
  peerConnection = getNewPeerConnection();
}

function updateUsername(newUsername) {
  ws.send(
    JSON.stringify({
      type: "change_username",
      value: { username: newUsername },
    })
  );
}

function respondToChatRequest(requestorId, accept) {
  ws.send(
    JSON.stringify({
      type: "chat_request_response",
      value: { requestorId, accept },
    })
  );
}

function sendChatRequest(
  requestedChatPartner = clients.filter(
    (client) => client.available && client.id !== clientId
  )[0]
) {
  ws.send(
    JSON.stringify({
      type: "connection_to_client_request",
      value: { requestedChatPartnerId: requestedChatPartner.id },
    })
  );
}

function getNewPeerConnection() {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
  peerConnection.onicecandidate = handleIceCandidate;
  peerConnection.ondatachannel = handleDataChannel;
  return peerConnection;
}

function disconnectFromPeer() {
  if (chatChannel) {
    chatChannel.close();
  }
  if (peerConnection) {
    peerConnection.close();
  }
  ws.send(
    JSON.stringify({
      type: "disconnect_from_partner",
      value: { partnerId: partnerId },
    })
  );
  peerConnection = getNewPeerConnection();
}
