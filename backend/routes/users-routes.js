const express = require("express");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.post("/signup", usersController.signup);
router.patch("/:uid", usersController.updateUser);



module.exports = router;
