const express = require("express");
const session = require("express-session");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");

router.get("/count", async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    //console.log(userCount);
    res.send({ userCount });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    if (!req.body.firstName) {
      res.statusCode = 500;
      res.send({
        name: "FirstNameError",
        message: "The first name is required",
      });
    } else {
      const user = await User.register(
        new User({ username: req.body.username }),
        req.body.password
      );

      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName || "";
      user.gift = req.body.gift;
      const token = getToken({ _id: user._id });
      const refreshToken = getRefreshToken({ _id: user._id });
      user.refreshToken.push({ refreshToken });
      await user.save();

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    }
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      const token = getToken({ _id: req.user._id });
      const refreshToken = getRefreshToken({ _id: req.user._id });
      const user = await User.findById(req.user._id);

      user.refreshToken.push({ refreshToken });
      await user.save();

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.send({ success: true, token });
    } catch (error) {
      res.statusCode = 500;
      res.send(error);
    }
  }
);

router.post("/refreshToken", async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });

      if (user) {
        // Find the refresh token against the user record in the database
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken
        );

        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken({ _id: userId });
          // If the refresh token exists, then create a new one and replace it.
          const newRefreshToken = getRefreshToken({ _id: userId });
          user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
          await user.save();

          res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
          res.send({ success: true, token });
        }
      } else {
        res.statusCode = 401;
        res.send("Unauthorized");
      }
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.get("/me", verifyUser, (req, res, next) => {
  res.send(req.user);
});

router.get("/logout", verifyUser, async (req, res, next) => {
  try {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    const user = await User.findById(req.user._id);

    const tokenIndex = user.refreshToken.findIndex(
      (item) => item.refreshToken === refreshToken
    );

    if (tokenIndex !== -1) {
      user.refreshToken.splice(tokenIndex, 1);
    }

    await user.save();

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.send({ success: true });
  } catch (error) {
    res.statusCode = 500;
    res.send(error);
  }
});

console.log("Router accessed");

module.exports = router;
