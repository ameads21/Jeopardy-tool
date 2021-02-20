const User = require("../models/user");
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
  "/:username/projectCreate",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_name, proj_description } = req.body.formData;
      let { id } = req.body.currentUser;
      const results = await User.saveProject(proj_name, proj_description, id);
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

//Deleting Project
router.delete(
  "/:username/project/:proj_id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id } = req.params;
      const results = await User.deleteProject({ proj_id });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
