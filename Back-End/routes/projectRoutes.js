const User = require("../models/user");
const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { user } = require("../db");

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

//Saving Columns
router.post(
  "/:username/project/:proj_id/columns",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { data } = req.body;
      let { proj_id } = req.params;
      const results = await User.saveColumns({ data, proj_id });
      await User.createStyles({ proj_id });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

//Getting project Columns
router.get(
  "/:username/project/:proj_id/columns",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id } = req.params;
      const results = await User.getColumns({ proj_id });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

//Saving Column Name
router.post(
  "/:username/project/:proj_id/titleSave",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id } = req.params;
      let { data } = req.body;
      const results = await User.saveColumnTitle({ proj_id, data });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

//Saving Other Styles
router.post(
  "/:username/project/:proj_id/styleSave",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id } = req.params;
      let { styleData } = req.body;
      const results = await User.saveStyles({ proj_id, styleData });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

//Getting Questions and Answers
router.get(
  "/:username/project/:proj_id/:column_id/getQuesandAnswers",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id, column_id } = req.params;
      const results = await User.getQuesandAnswers({ proj_id, column_id });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/:username/project/:proj_id/:column_id/getQuesandAnswers",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      let { proj_id, column_id } = req.params;
      let { data } = req.body;
      console.log(data);
      const results = await User.saveQuesandAnswers({
        proj_id,
        column_id,
        data,
      });
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
