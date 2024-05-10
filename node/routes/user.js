const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.route("/insertTestUsers")
    .get(userController.insertUserTest)
router.route("/")
    .get(userController.getUsers);

module.exports = router;