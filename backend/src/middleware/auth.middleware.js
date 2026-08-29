const jwt = require("jsonwebtoken");

const verifyjwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    // console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyjwt;