const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const todosRoutes = require("./routes/todos");
const userRoutes = require("./routes/user");

const app = express();

mongoose.
connect('mongodb://admin:password@localhost:27017/default?authSource=admin', {useNewUrlParser: true})
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/todos", todosRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
