const jsonschema = require("jsonschema");
const express = require("express");
const router = express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { ensureCorrectUser } = require("../middleware/auth");

router.get("/", (req, res, next) => {
  res.send("App is working!!");
});

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password, id } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

//Deleting User
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const results = await User.delete(req.params.username);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
