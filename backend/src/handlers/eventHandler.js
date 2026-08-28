const pushHandler = require("./push.Handler")
const pullHandler = require("./pull.Handler");
const issuesHandler = require("./issue.Handler");

module.exports = {
    pushHandler,
    pullHandler,
    issuesHandler,
};