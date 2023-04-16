const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

function matchClients() {
  const unmatchedClients = [...clients].filter((client) => !client.partner);

  if (unmatchedClients.length >= 2) {
    const [client1, client2] = unmatchedClients;
    client1.partner = client2;
    client2.partner = client1;

    client1.send(JSON.stringify({ type: "initiate", partnerId: client2.id }));
    client2.send(JSON.stringify({ type: "partner", partnerId: client1.id }));
  }
}

wss.on("connection", (ws) => {
  ws.id = Date.now();
  clients.add(ws);

  ws.send(JSON.stringify({ type: "id", value: ws.id }));

  matchClients();

  ws.on("message", (message) => {
    if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
      ws.partner.send(message.toString());
    }
    console.log("Received message:" + message.toString());
  });

  ws.on("close", () => {
    clients.delete(ws);
    if (ws.partner) {
      ws.partner.partner = null;
      matchClients();
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
