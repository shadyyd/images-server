const express = require("express");
require("express-async-errors");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const AppError = require("./utils/AppError");

const app = express();

// Middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the API!" });
});

app.all("/*", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

// Error handling middleware

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    console.error("AppError:", err);
    return res.status(err.statusCode).send({ error: err.message });
  } else {
    console.error("Error:", err);
    return res.status(500).send({ error: "Something went wrong!" });
  }
});

// Database
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
