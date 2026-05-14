import express from "express";
import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(join(__dirname, "public")));

// Log what's in the scramjet folder so we can see the right path
import { readdirSync } from "fs";
try {
  const scramjetFiles = readdirSync(join(__dirname, "node_modules/@mercuryworkshop/scramjet"));
  console.log("Scramjet folder contents:", scramjetFiles);
} catch(e) {
  console.log("Scramjet folder error:", e.message);
}

app.use("/scram/", express.static(join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")));
app.use("/baremux/", express.static(join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")));
app.use("/epoxy/", express.static(join(__dirname, "node_modules/@mercuryworkshop/epoxy-transport/dist")));

const server = createServer(app);
server.on("upgrade", (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => console.log(`Running on port ${PORT}`));
