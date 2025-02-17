const express = require("express");
const { createUser, login } = require("../controllers/user/login");

const router = express.Router();

router.post("/createUser", createUser);
router.post("/login", login);

module.exports = router;