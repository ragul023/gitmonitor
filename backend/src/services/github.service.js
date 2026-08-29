const axios = require("axios");

const getGithubAccessToken = async (code) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.data.access_token) {
    throw new Error(
      response.data.error_description ||
        "Failed to get GitHub access token"
    );
  }

  return response.data.access_token;
};

const getGithubUser = async (accessToken) => {
  const response = await axios.get(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  return response.data;
};

const getGithubEmail = async (accessToken) => {
  const response = await axios.get(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const primaryEmail = response.data.find(
    (email) => email.primary && email.verified
  );

  return primaryEmail?.email || null;
};

module.exports = {
  getGithubAccessToken,
  getGithubUser,
  getGithubEmail,
};