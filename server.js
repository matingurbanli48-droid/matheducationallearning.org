const express = require("express");
const { createBareServer } = require("bare-server-node");
const path = require("path");
const http = require("http");

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/uv/", express.static(path.join(__dirname, "node_modules/@titaniumnetwork-dev/ultraviolet/dist")));
app.use("/uv/uv.config.js", (req, res) => {
  res.type("js").send(`
    self.__uv$config = {
      prefix: "/service/",
      bare: "/bare/",
      encodeUrl: Ultraviolet.codec.xor.encode,
      decodeUrl: Ultraviolet.codec.xor.decode,
      handler: "/uv/uv.handler.js",
      bundle: "/uv/uv.bundle.js",
      config: "/uv/uv.config.js",
      sw: "/uv/uv.sw.js",
    }
  `);
});

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
