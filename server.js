const express = require("express");
const { createServer } = require("http");
const path = require("path");
const wisp = require("wisp-server-node");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uv/", express.static(path.join(__dirname, "node_modules/@titaniumnetwork-dev/ultraviolet/dist")));

const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => console.log(`Running on port ${PORT}`));
