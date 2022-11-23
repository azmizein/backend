
const express = require("express");
const cors = require("cors");
const PORT = 2000;
const server = express();
const db = require("./models");
const bearerToken = require("express-bearer-token");

server.use(express.json());
server.use(cors());
server.use(bearerToken());

const { authRoutes } = require("./routers");
server.use(authRoutes);

server.listen(PORT, () => {
  db.sequelize.sync({ alter: true });
  console.log("Success Running at PORT: " + PORT);
});
