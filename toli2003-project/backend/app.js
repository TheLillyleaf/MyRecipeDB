const express = require("express");
const mongoose = require("mongoose");

const recipeRoute = require("./routes/recipe");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://toli2003Project:jaghetertobias@dt190g.knvkt.mongodb.net/toli2003-project?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Connection failed: " + err);
  });
//CORS headers.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/recipe", recipeRoute);
app.use("/api/user", userRoutes);

module.exports = app;
