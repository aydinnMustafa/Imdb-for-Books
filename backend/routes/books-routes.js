const express = require("express");

const booksController = require("../controllers/books-controller");
const router = express.Router();


router.get('/', booksController.getBooks);
router.post('/favorites', booksController.getFavoriteBooks);
router.post('/addfavorite', booksController.addFavoriteBook);
router.get('/:bid', booksController.getBookById);

module.exports = router;