const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // GitHub account ID
    githubId: {
      type: Number,
      unique: true,
      sparse: true,
    },

    // Username for GitHub Monitor
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // GitHub username
    githubUsername: {
      type: String,
      trim: true,
    },

    // Application email
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    // Application password
    password: {
      type: String,
      select: false,
    },

    // GitHub email
    githubEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // GitHub OAuth access token
    githubAccessToken: {
      type: String,
      select: false,
    },

    // GitHub profile information
    avatarUrl: {
      type: String,
    },

    profileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);