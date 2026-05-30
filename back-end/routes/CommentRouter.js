const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

router.get("/commentsOfUser/:id", async (req, res) => {
  try {
    const allPhotos = await Photo.find({}).lean();
    let userComments = [];
    allPhotos.forEach((photo) => {
      (photo.comments || []).forEach((c) => {
        if (c.user_id.toString() === req.params.id) {
          userComments.push({
            ...c,
            photo_id: photo._id,
            file_name: photo.file_name,
            photo_owner_id: photo.user_id,
          });
        }
      });
    });
    res.json(userComments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).send("Comment cannot be empty");
  }
  if (!mongoose.Types.ObjectId.isValid(photo_id)) {
    return res.status(400).send("Invalid photo_id");
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) return res.status(400).send("Photo not found");

    const newComment = {
      comment: comment.trim(),
      date_time: new Date(),
      user_id: req.user_id,
    };
    photo.comments.push(newComment);
    await photo.save();

    const author = await User.findById(
      req.user_id,
      "_id first_name last_name"
    ).lean();
    const saved = photo.comments[photo.comments.length - 1].toObject();
    saved.user = author;

    return res.status(200).json(saved);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
