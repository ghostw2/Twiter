const express = require('express')
const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/", chatController.loadById);
router.get("/messages",chatController.loadChatMessages)
router.post("/new",chatController.createChat)
module.exports = router;