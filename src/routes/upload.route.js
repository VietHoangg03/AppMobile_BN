const router = require("express").Router();
const multer = require("multer");
const uploadCtrl = require("../controllers/upload.controller");
const fs = require("fs-extra");

const upload = multer({
  storage: multer.memoryStorage({
    // destination: (req, res, cb) => {
    //   const dest = "uploads/";
    //   let stat = null;
    //   try {
    //     stat = fs.statSync(dest);
    //   } catch (err) {
    //     fs.mkdirSync(dest);
    //   }
    //   cb(null, dest);
    // },
  }),
  // dest: "uploads/",
});

// const storage = multer.diskStorage({
//   destination(req, file, callback) {
//     callback(null, "./images");
//   },
//   filename(req, file, callback) {
//     callback(null, `${Date.now()}.jpg`);
//   },
// });
// const upload = multer({ storage });

router.post("/image", upload.single("image"), uploadCtrl.uploadImage);

router.post("/video", upload.single("video"), uploadCtrl.uploadVideo);

module.exports = router;
