const Repository = require("../models/Repository.model");
const User = require("../models/User.model");
const Event = require("../models/Events.models");

const issuesHandler = async (payload, deliveryId) => {
    console.log("Reached Issues Handler");

    // Repository
    const repoData = payload.repository;

    const repo = await Repository.findOneAndUpdate(
        {
            githubId: repoData.id,
        },
        {
            githubId: repoData.id,
            name: repoData.name,
            fullName: repoData.full_name,

            owner: {
                githubId: repoData.owner.id,
                username: repoData.owner.login,
            },

            defaultBranch: repoData.default_branch,
            private: repoData.private,
            visibility: repoData.visibility,
            language: repoData.language,

            url: repoData.url,
            htmlUrl: repoData.html_url,
        },
        {
            new: true,
            upsert: true,
        }
    );

    // User
    const userData = payload.sender;

    const user = await User.findOneAndUpdate(
        {
            githubId: userData.id,
        },
        {
            githubId: userData.id,
            username: userData.login,
            avatarUrl: userData.avatar_url,
            profileUrl: userData.html_url,
        },
        {
            new: true,
            upsert: true,
        }
    );

    // Event
    const event = await Event.create({
        deliveryId,

        eventType: "issues",

        repositoryId: repo._id,

        actorId: user._id,

        status: "processed",

        processedAt: new Date(),
    });

    console.log("Issue event saved:", event._id);

    return event;
};

module.exports = issuesHandler;