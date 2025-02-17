const express = require("express");
const router = express.Router();
const UserInfo = require("../models/UserInfo");

// GET all user info
router.get("/", async (req, res) => {
  try {
    const users = await UserInfo.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: "Error retrieving user info" });
  }
});

// GET a single user info by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await UserInfo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error retrieving user info" });
  }
});

// CREATE new user info
router.post("/", async (req, res) => {
  try {
    const newUserInfo = new UserInfo(req.body);
    await newUserInfo.save();
    res.json(newUserInfo);
  } catch (error) {
    res.status(400).json({ message: "Error creating user info" });
  }
});

// UPDATE user info
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await UserInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error updating user info" });
  }
});

// DELETE user info
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await UserInfo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User info deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting user info" });
  }
});

module.exports = router;
