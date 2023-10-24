require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const firebase = require("../services/firebase");
const resourceMessenger = require("../utils/resource");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadCtrl = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send(resourceMessenger.msg.err.fileNotFound);
      }

      let idv4 = uuidv4();
      const blob = firebase.bucket.file(`images/${idv4}`);

      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobWriter.on("error", (err) => {
        console.log(err);
      });

      blobWriter.on("finish", () => {
        let publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          firebase.bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        res.status(200).json({
          msg: resourceMessenger.msg.success.uploadFile,
          url: publicUrl,
        });
      });

      blobWriter.end(req.file.buffer);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  uploadVideo: async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).send(resourceMessenger.msg.err.fileNotFound);
      }

      let idv4 = uuidv4();
      const blob = firebase.bucket.file(`videos/${idv4}`);

      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobWriter.on("error", (err) => {
        console.log(err);
      });

      blobWriter.on("finish", () => {
        let publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          firebase.bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        res.status(200).json({
          msg: resourceMessenger.msg.success.uploadFile,
          url: publicUrl,
        });
      });

      blobWriter.end(req.file.buffer);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  uploadImage2: async (req, res) => {
    try {
      const result = await streamUpload(req);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  },
};

const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        console.log(result);
        resolve(result);
      } else {
        console.log(error);
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

module.exports = uploadCtrl;
