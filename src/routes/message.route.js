const router = require("express").Router();
const messageCtrl = require("../controllers/message.controller");

router.get(
  "/whole/conversation/:conversationId",
  messageCtrl.getAllInConversation
);

router.get("/conversation/:conversationId", messageCtrl.getDefault);

router.get("/last", messageCtrl.getLastMessages);

router.get("/:msgId", messageCtrl.getById);

router.get("/filter/conversation", messageCtrl.searchMsg);

router.post("/", messageCtrl.createMsg);

router.patch("/:messageId", messageCtrl.removeMsg);

router.get('/latest-msg/:conversationId', messageCtrl.getTheLast);

module.exports = router;
