const express = require('express');

const usersController = require('../controllers/users-controllers');
const auth = require('../middleware/auth');



const router = express.Router();





router.post('/signup', usersController.signup);
// router.post('/login');
router.use(auth);


module.exports = router;