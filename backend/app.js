const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("./middleware/auth");
const usersRoutes = require("./routes/users-routes");
const booksRoutes = require("./routes/books-routes");
const app = express();

require("dotenv").config();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // tüm kaynaklara erişime izin ver
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // izin verilen headerlar
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // izin verilen HTTP metotları
    return res.status(200).json({});
  }
  next();
});

// app.use("/books", auth);
// app.use("/likes", auth);
app.use("/api/users", usersRoutes);
app.use("/api/books", booksRoutes);


app.use((req, res, next) => {
  const error = new Error("Böyle bir dizin bulunamadı.");
  error.status = 404;
  throw error;
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
