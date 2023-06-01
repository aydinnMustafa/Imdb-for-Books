const express = require("express");

const usersController = require("../controllers/users-controllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", usersController.signup);
router.get("/", usersController.getUsers);
router.patch("/:uid", usersController.updateUser);
router.delete("/:uid", usersController.deleteUser);



module.exports = router;
