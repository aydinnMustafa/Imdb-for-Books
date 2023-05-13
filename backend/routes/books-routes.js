const express = require("express");

const booksController = require("../controllers/books-controller");

const router = express.Router();

router.post('/add', booksController.addBook);

module.exports = router;




module.exports = router;