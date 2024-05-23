const express = require("express");
const dotenv = require("dotenv");
const configureRoutes = require("./routers");
const connectDB = require("./helpers/connectDB");
const cors = require("cors");
const http = require("http");
const connectSocketIo = require("./helpers/connectSocketIo");

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const server = http.createServer(app);


const io = connectSocketIo(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

configureRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ errors:{
    message: err.message || "Internal server error",
  } });
});

server.listen(process.env.PORT, () => {
  console.log("Server is running");
});
