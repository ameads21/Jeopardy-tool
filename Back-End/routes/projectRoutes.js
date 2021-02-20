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

//Saving Project Name And Description
router.post(
  "/:username/projectDetails",
  ensureCorrectUser,
  async function (req, res, next) {
    let { proj_name, proj_description } = req.body.formData;
    let { id } = req.body.currentUser;
    console.log("******************************");
    const results = await User.saveProject(
      req.params.username,
      proj_name,
      proj_description,
      id
    );
    return res.json({ results });
  }
);

module.exports = router;
