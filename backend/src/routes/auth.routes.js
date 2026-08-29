const express = require("express");

const {
  register,
  login,
  githubAuth,
  githubCallback,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/github/start",
  authMiddleware,
  githubAuth
);

router.get(
  "/github/callback",
  githubCallback
);

module.exports = router;