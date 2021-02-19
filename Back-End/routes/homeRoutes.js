const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("App is working!!");
});

module.exports = router;
