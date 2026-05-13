const express = require("express");
const { createBareServer } = require("bare-server-node");
const path = require("path");
const http = require("http");

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/@titaniumnetwork-dev/ultraviolet/dist")));

const server = http.createServer((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(process.env.PORT || 3000);
