const express = require("express");

const booksController = require("../controllers/books-controller");
const auth = require("../middleware/auth");
const router = express.Router();


router.get('/', booksController.getBooks);
router.post('/favorites', booksController.getFavoriteBooks);
router.post('/addfavorite', booksController.addFavoriteBook);
router.get('/:bid', booksController.getBookById);

router.post('/add', booksController.addBook);
router.delete('/:bid', booksController.deleteBook);
router.patch('/:bid', booksController.updateBook);
module.exports = router;