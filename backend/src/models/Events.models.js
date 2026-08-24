const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        deliveryId: {
            type: String,
            unique: true,
            index: true,
        },

        eventType: {
            type: String,
            required: true,
            index: true,
        },

        repositoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
        },

        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        branch: String,

        ref: String,

        beforeSha: String,

        afterSha: String,

        forced: Boolean,

        created: Boolean,

        deleted: Boolean,

        compareUrl: String,

        commitCount: {
            type: Number,
            default: 0,
        },

        headCommitSha: String,

        status: {
            type: String,
            enum: ["received", "processed", "failed"],
            default: "received",
        },

        receivedAt: {
            type: Date,
            default: Date.now,
        },

        processedAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Event", eventSchema);