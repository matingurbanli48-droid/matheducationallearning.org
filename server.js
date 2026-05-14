const express = require("express");
const { createBareServer } = require("bare-server-node");
const path = require("path");
const http = require("http");

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/scramjet/", express.static(path.join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")));

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));
