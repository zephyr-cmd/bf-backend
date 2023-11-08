const express = require("express");
const app = express();
const mongoose = require("mongoose");
const DBConnect = require("./utils/dbConnect");
const cors = require("cors");
const path = require("path");
var logger = require("morgan");
var http = require("http").Server(app);
const { Server } = require("socket.io");
//attached http server to the socket io
const io = new Server(http, {
  cors: {
    origin: "*",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

const cookieParser = require("cookie-parser");
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));

// Database connection
DBConnect();

app.use("/public", express.static(path.join(__dirname, "public")));

// Routes start
app.use("/api/v1/modules", require("./Modules"));
app.get("/", (req, res) => {
  res.send("Server is Ok!...");
});
// Routes end

const port = process.env.PORT || 7000;
const server = http.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
