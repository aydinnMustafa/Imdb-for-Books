const express = require("express");
const bodyParser = require("body-parser");

const auth = require('./middleware/auth');
const usersRoutes = require('./routes/users-routes');

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


app.use('/api/users', usersRoutes);


app.use((req, res, next) => {
  const error = new Error('Böyle bir dizin bulunamadı.');
  error.status = 404;
  throw error;
});

app.post("/api/auth", auth,(req, res,) => {
  
});
  
    app.listen(5000);
  