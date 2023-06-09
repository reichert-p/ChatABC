const WebSocket = require("ws");
const http = require("http");
const { v4: uuidv4 } = require("uuid");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

function updateClients() {
  const allClients = clients
    .map((client) => ({ id: client.id, username: client.username, available: !client.connected }));
  const message = JSON.stringify({
    type: "available_clients",
    value: { availableClients: allClients },
  });
  clients.forEach((client) => client.ws.send(message));
}

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  ws.id = clientId;
  clients.push({ id: clientId, ws: ws, connected: false, username: "anonymous" });

  ws.send(JSON.stringify({ type: "id", value: { clientId: clientId } }));
  updateClients();

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    const clientId = ws.id;
    const partnerId = message.value.partnerId;
    const target = clients.find((client) => client.partnerId === clientId);

    if (message.type === "change_username") {
      const client = clients.find((client) => client.id === clientId);
      if (client) {
        client.username = message.value.username;
        updateClients();
      }
    } else if (message.type === "initiate") {
      const client = clients.find((client) => client.id === clientId);
      const partner = clients.find((client) => client.id === partnerId);
      if (client && partner) {
        client.connected = true;
        partner.connected = true;
        updateClients();
        partner.ws.send(
          JSON.stringify({ type: "partner", value: { partnerId: clientId } })
        );
        ws.send(
          JSON.stringify({ type: "initiate", value: { partnerId: partnerId } })
        );
      }
    } else if (message.type === "connection_to_client_request") {
      const client = clients.find((client) => client.id === clientId);
      const requestedClientId = message.value.requestedChatPartnerId;
      const requestedClient = clients.find(
        (client) => client.id === requestedClientId
      );
      if (client && requestedClient) {
        requestedClient.ws.send(
          JSON.stringify({
            type: "chat_request",
            value: { requestorId: clientId },
          })
        );
      }
    } else if (message.type === "chat_request_response") {
      const client = clients.find((client) => client.id === clientId);
      const requestorId = message.value.requestorId;
      const partner = clients.find((client) => client.id === requestorId);
      const wantsToConnect = message.value.accept;
      if (client && partner && wantsToConnect) {
        client.connected = true;
        client.partnerId = partner.id;
        partner.partnerId = client.id;
        partner.connected = true;
        updateClients();
        ws.send(
          JSON.stringify({ type: "partner", value: { partnerId: partner.id } })
        );
        partner.ws.send(
          JSON.stringify({ type: "initiate", value: { partnerId: clientId } })
        );
      } else if (client && partner && !wantsToConnect) {
        partner.ws.send(
          JSON.stringify({
            type: "chat_request_rejected",
            value: { requestedChatPartnerId: clientId },
          })
        );
      }
    } else if (message.type === "disconnect_from_partner") {
      const client = clients.find((client) => client.id === clientId);
      const partner = clients.find((client) => client.partnerId === clientId);
      if (client) {
        client.connected = false;
        client.partnerId = null;
      }
      if (partner) {
        partner.connected = false;
        partner.partnerId = null;
      }
      updateClients();
    }
    else if (target) {
      target.ws.send(data.toString());
    }
  });

  ws.on("close", () => {
    const clientId = ws.id;
    // set partner to disconnected
    const partner = clients.find((client) => client.partnerId === clientId);
    if (partner) {
      partner.connected = false;
      partner.partnerId = null;
    }
    clients = clients.filter((client) => client.id !== clientId);
    updateClients();
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
