const express = require("express");

const booksController = require("../controllers/books-controller");

const router = express.Router();

router.post('/add', booksController.addBook);
router.post('/addfavorite', booksController.addFavoriteBook);
router.get('/', booksController.getBooks);
router.delete('/:bid', booksController.deleteBook);
router.patch('/:bid', booksController.updateBook);
router.post('/favorites', booksController.getFavoriteBooks);
router.get('/:id', booksController.getBookById);



module.exports = router;