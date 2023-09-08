const express = require("express");

const adminController = require("../controllers/admin-controller");
const router = express.Router();

//Books
router.post('/book/add', adminController.addBook);
router.get('/books', adminController.getBooks);
router.patch('/book/:bid', adminController.updateBook);
router.delete('/book/:bid', adminController.deleteBook);


//Users
router.get('/users', adminController.getUsers);
router.patch('/user/:uid', adminController.updateUser);
router.delete("/user/:uid", adminController.deleteUser);

//Dashboard
router.get('/dashboard', adminController.getDashboardData);


module.exports = router;