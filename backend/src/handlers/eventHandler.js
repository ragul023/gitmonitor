


const pushHandler = (payload) => {
    console.log("Push Handler Working");

    console.log("Pusher:", payload.pusher?.name);
    console.log("Repository:", payload.repository?.full_name);
    console.log("Commits:", payload.commits?.length || 0);
};

const pullHandler = (payload) => {
    console.log("Pull Request Handler Working");

    // console.log("Action:", payload.action);
    // console.log("Pull Request:", payload.pull_request?.title);
    // console.log("Repository:", payload.repository?.full_name);
    // console.log("Author:", payload.sender?.login);


};

const issuesHandler = (payload) => {
    console.log("Issues Handler Working");

    console.log("Action:", payload.action);
    console.log("Issue:", payload.issue?.title);
    console.log("Repository:", payload.repository?.full_name);
    console.log("Author:", payload.sender?.login);
};

module.exports = {
    pushHandler,
    pullHandler,
    issuesHandler,
};