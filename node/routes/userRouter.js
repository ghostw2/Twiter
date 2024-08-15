const express = require("express");
const router = express.Router();

const authController = require("../controllers/userContoller");

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/users', authController.loadAll)
router.post('/retrive',authController.retrive)
module.exports = router; 