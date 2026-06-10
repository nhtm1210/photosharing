const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const requireLogin = require("../middleware/requireLogin");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = req.body;

  if (!login_name) return res.status(400).send("login_name is required");
  if (!password) return res.status(400).send("password is required");
  if (!first_name) return res.status(400).send("first_name is required");
  if (!last_name) return res.status(400).send("last_name is required");

  try {
    const existed = await User.findOne({ login_name });
    if (existed) return res.status(400).send("login_name already exists");
    const newUser = await User.create({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || "",
    });
    return res.json({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.get("/list", requireLogin, async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name").lean();
    const allPhotos = await Photo.find({}).lean();

    const augmentedUsers = users.map((user) => {
      let photoCount = 0;
      let commentCount = 0;
      allPhotos.forEach((photo) => {
        if (photo.user_id.toString() === user._id.toString()) photoCount++;
        (photo.comments || []).forEach((c) => {
          if (c.user_id.toString() === user._id.toString()) commentCount++;
        });
      });
      return { ...user, photoCount, commentCount };
    });
    res.json(augmentedUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:id", requireLogin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid ID");
  try {
    const user = await User.findById(
      req.params.id,
      "_id first_name last_name location description occupation"
    ).lean();
    user ? res.json(user) : res.status(400).send("Not found");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
