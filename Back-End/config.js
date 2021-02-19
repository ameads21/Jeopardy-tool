require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev-key";

const PORT = +process.env.PORT || 3001;

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "jeopardy_test"
    : process.env.DATABASE_URL || "jeopardy_tool";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
