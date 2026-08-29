const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
    {
        githubId: {
            type: Number,
            required: true,
            unique: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            unique: true,
        },

        owner: {
            githubId: Number,
            username: String,
        },

        defaultBranch: String,

        private: Boolean,

        visibility: String,

        language: String,

        url: String,

        htmlUrl: String
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Repository", repoSchema);