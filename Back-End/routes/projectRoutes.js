const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");

const router = express.Router();

//Getting all projects from specified user
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const projects = await User.projects(req.params.username);
    return res.json({ projects });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
