const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  getGithubAccessToken,
  getGithubUser,
  getGithubEmail,
} = require("../services/github.service");

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        user_id: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      message: "User Created Successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// START GITHUB OAUTH
// ==========================================

// const githubAuth = (req, res) => {
//   try {
//     const state = crypto.randomBytes(32).toString("hex");

//     /*
//       Store the OAuth state in an HttpOnly cookie.
//       This allows the callback to verify that
//       the OAuth request was started by our application.
//     */

//     res.cookie("github_oauth_state", state, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 10 * 60 * 1000,
//     });

//     /*
//       Store the currently authenticated
//       application user.
//     */

//     res.cookie(
//       "github_oauth_user",
//       req.user.user_id.toString(),
//       {
//         httpOnly: true,
//         secure: false,
//         sameSite: "lax",
//         maxAge: 10 * 60 * 1000,
//       }
//     );

//     const githubUrl =
//       "https://github.com/login/oauth/authorize" +
//       `?client_id=${process.env.GITHUB_CLIENT_ID}` +
//       `&redirect_uri=${encodeURIComponent(
//         process.env.GITHUB_CALLBACK_URL
//       )}` +
//       `&scope=${encodeURIComponent(
//         "read:user user:email repo"
//       )}` +
//       `&state=${state}`;

//     return res.json({
//       url: githubUrl,
//     });
//   } catch (error) {
//     console.error("GitHub Auth Error:", error);

//     return res.status(500).json({
//       message: "Unable to start GitHub authentication",
//     });
//   }
// };

const githubAuth = (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    const oauthData = JSON.stringify({
      state,
      userId: req.user.user_id.toString(),
    });

    res.cookie("github_oauth", oauthData, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
      path: "/",
    });

    console.log("\n========== OAUTH START ==========");
    console.log("User ID:", req.user.user_id);
    console.log("Generated State:", state);
    console.log("=================================");

    const githubUrl =
      "https://github.com/login/oauth/authorize" +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(
        process.env.GITHUB_CALLBACK_URL
      )}` +
      `&scope=${encodeURIComponent(
        "read:user user:email repo"
      )}` +
      `&state=${state}`;

    return res.json({
      url: githubUrl,
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error);

    return res.status(500).json({
      message: "Unable to start GitHub authentication",
    });
  }
};

// ==========================================
// GITHUB CALLBACK
// ==========================================

const githubCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const oauthCookie = req.cookies.github_oauth;

    console.log("\n========== OAUTH CALLBACK ==========");
    console.log("Returned State:", state);
    console.log("OAuth Cookie:", oauthCookie);
    console.log("All Cookies:", req.cookies);
    console.log("====================================");

    if (!code || !state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/connect-github?error=oauth_failed`
      );
    }

    if (!oauthCookie) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/connect-github?error=session_expired`
      );
    }

    const { state: savedState, userId } =
      JSON.parse(oauthCookie);

    console.log("Saved State:", savedState);
    console.log("User ID:", userId);

    if (!savedState || state !== savedState) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/connect-github?error=invalid_state`
      );
    }

    if (!userId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=session_expired`
      );
    }

    const githubAccessToken =
      await getGithubAccessToken(code);

    const githubUser =
      await getGithubUser(githubAccessToken);

    const githubEmail =
      await getGithubEmail(githubAccessToken);

    const existingGithubUser =
      await User.findOne({
        githubId: githubUser.id,
      });

    if (
      existingGithubUser &&
      existingGithubUser._id.toString() !== userId
    ) {
      res.clearCookie("github_oauth");

      return res.redirect(
        `${process.env.FRONTEND_URL}/connect-github?error=github_already_connected`
      );
    }

    await User.findByIdAndUpdate(userId, {
      githubId: githubUser.id,
      githubUsername: githubUser.login,
      githubEmail,
      githubAccessToken,
      avatarUrl: githubUser.avatar_url,
      profileUrl: githubUser.html_url,
    });

    res.clearCookie("github_oauth");

    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard`
    );
  } catch (error) {
    console.error("GitHub OAuth Error:", error);

    res.clearCookie("github_oauth");

    return res.redirect(
      `${process.env.FRONTEND_URL}/connect-github?error=oauth_failed`
    );
  }
};

module.exports = {
  register,
  login,
  githubAuth,
  githubCallback,
};