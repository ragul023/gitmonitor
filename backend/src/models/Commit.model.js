const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema(
    {
        sha: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
        },

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },

        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        committerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        message: String,

        treeSha: String,

        committedAt: Date,

        url: String,

        addedFiles: [String],

        removedFiles: [String],

        modifiedFiles: [String],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Commit", commitSchema);