const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database/connectionDB");
const AllRoutes = require("./routes/AllRoutes.routes");

const mongoose = require("mongoose");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);

const port = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
global.io = io;
io.on("connection", (socket) => {
  console.log("A user connected to WebSocket");

  socket.on("disconnect", () => {
    console.log("A user disconnected from WebSocket");
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  connectDB();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/", AllRoutes);
