const router = require("express").Router();
const userCtrl = require("../controllers/user.controller");

router.get('/admin', userCtrl.getAll);

router.get("/search", userCtrl.searchUsers);

router.get("/friend-request/sent", userCtrl.getListFriendRequestSent);

router.get("/friend-request/received", userCtrl.getListFriendRequestReceived);

router.get("/", userCtrl.getUsers);

router.get("/:id", userCtrl.getUserById);

router.post("/story", userCtrl.createStory);

router.post("/request-friend/:id", userCtrl.sendFriendRequest);

router.post("/friend-request/:id/accept", (req, res) => {
  res.status(200).send("accept");
});

router.post("/friend-request/:id/reject", (req, res) => {
  res.status(200).send("reject");
});

router.delete("/story/:id", userCtrl.deleteStory);

router.patch("/", userCtrl.updateInfoUser);

router.patch("/privacy", userCtrl.updatePrivacyUser);

module.exports = router;
