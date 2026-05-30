const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "images")),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  },
});

router.get("/photosOfUser/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");
  try {
    const photos = await Photo.find({ user_id: req.params.id }).lean();
    const result = await Promise.all(
      photos.map(async (photo) => {
        const comments = await Promise.all(
          (photo.comments || []).map(async (c) => {
            const author = await User.findById(
              c.user_id,
              "_id first_name last_name"
            ).lean();
            return { ...c, user: author };
          })
        );
        return { ...photo, comments };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/new", upload.single("uploadedphoto"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  try {
    const photo = await Photo.create({
      file_name: req.file.filename,
      user_id: req.user_id,
      date_time: new Date(),
      comments: [],
    });
    return res.status(200).json(photo);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
