import express from "express";
import { createServer } from "http";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import wisp from "@mercuryworkshop/wisp-js/server";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(join(__dirname, "public")));
app.use("/scram/", express.static(join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")));
app.use("/baremux/", express.static(join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")));
app.use("/epoxy/", express.static(join(__dirname, "node_modules/@mercuryworkshop/epoxy-transport/dist")));

const server = createServer(app);
wisp.routeRequest(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on port ${PORT}`));
