const Repository = require("../models/Repository.model");
const User = require("../models/User.model");
const Event = require("../models/Events.models");

const pushHandler = async (payload, deliveryId) => {
  console.log("Reached Push Handler");
  console.log("Payload is Given As :", payload);

  // Repository insertions

  const repoData = payload.repository;

  const repo = await Repository.findOneAndUpdate(
    {
      githubId: repoData.id,
    },
    {
        githubId : repoData.id,
        name : repoData.name,
        fullName : repoData.full_name,

        owner:{
            githubId : repoData.owner.id,
            username: repoData.owner.login,
        },

        defaultBranch : repoData.default_branch,

        private : repoData.private,

        visibility : repoData.visibility,

        language : repoData.language,

        url: repoData.url,

        htmlUrl : repoData.html_url
    },        {
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

        eventType: "push",

        repositoryId: repo._id,

        actorId: user._id,

        ref: payload.ref,

        branch: payload.ref.replace("refs/heads/", ""),

        beforeSha: payload.before,

        afterSha: payload.after,

        forced: payload.forced,

        created: payload.created,

        deleted: payload.deleted,

        compareUrl: payload.compare,

        commitCount: payload.commits.length,

        headCommitSha: payload.head_commit?.id,

        status: "processed",

        processedAt: new Date(),
    });

    console.log("Push event saved:", event._id);

    return event;
};

module.exports = pushHandler;
