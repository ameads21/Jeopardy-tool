const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projRoutes = require("./routes/projectRoutes");
const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressError");

const app = express();
app.use(cors());
app.use(authenticateJWT);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
