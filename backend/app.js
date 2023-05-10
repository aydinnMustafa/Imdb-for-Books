const express = require("express");
const bodyParser = require("body-parser");



const app = express();


app.use(bodyParser.json());



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.post("/api/auth", (req, res, next) => {
   
  console.log(req.rawHeaders[15]);
  console.log(req.body);
});

app.listen(5000);
