require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const router = new express.Router();
const bodyParserv = require("body-parser");
const User = require("../models/auth");
const Follower = require("../models/follower");
const db = require("../config/dbconfig");
const jwt = require("jsonwebtoken");
const atob = require("atob");

// follow by username
router.post("/users/:userName/follow", async (req, res) => {
  try {
    const userName = req.params.userName;
    const accessToken = req.body.accessToken;
    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Send access token",
      });
    const dec = accessToken.split(".")[1];
    if (!dec) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
    }
    const decode = JSON.parse(atob(dec));
    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
      }
      console.log(decode);
    console.log(decode.user_create.name);
    if (userName == decode.user_create.name) {
      res.status(400).send({ message: "You cannot follow yourself" });
    }

    const toUser = await User.findOne({ userName });

    let fromFollow = await Follower.findOne({
      user: decode.user_create,
    });
    let toFollow = await Follower.findOne({
      user: toUser._id,
    });

    if (fromFollow == null) {
      fromFollow = new Follower({ user: decode.user_create._id });
    }
    if (toFollow == null) {
      toFollow = new Follower({ user: toUser._id });
    }

    if (fromFollow.following.includes(toUser._id)) {
      fromFollow.following.pull(toUser._id);
      toFollow.followers.pull(decode.user_create._id);
      await fromFollow.save();
      await toFollow.save();
      return res.status(200).json({
        success: true,
        message: "Successfully unfollowed",
      });
    } else {
      fromFollow.following.push(toUser._id);
      toFollow.followers.push(decode.user_create._id);
      await fromFollow.save();
      await toFollow.save();
      return res.status(200).json({
        success: true,
        message: "Successfully followed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
});

// Unfollow user by his/her username
router.delete("/users/:username/follow", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Send access token",
      });
    const dec = accessToken.split(".")[1];
    if (!dec) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
    }
    const decode = JSON.parse(atob(dec));
    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
    }

    const toUser = await User.findOne({ userName });

    let fromFollow = await Follower.findOne({
      user: decode.usercreate._id,
    });
    let toFollow = await Follower.findOne({
      user: toUser._id,
    });

    if (fromFollow.following.includes(toUser._id)) {
      fromFollow.following.pull(toUser._id);
      toFollow.followers.pull(decode.usercreate._id);
      await fromFollow.save();
      await toFollow.save();
      return res.status(200).json({
        success: true,
        message: "Successfully unfollowed",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
});

// Retrieve a list of followers for a specific user
router.get("/users/:username/followers", async (req, res) => {
  try {
    const accessToken = req.body.accessToken;
    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Send access token",
      });
    const dec = accessToken.split(".")[1];
    if (!dec) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
    }
    const decode = JSON.parse(atob(dec));
    if (!decode) {
      return res.status(400).json({
        success: false,
        message: "Send access token in proper format.",
      });
    }
    let fromFollow = await Follower.findOne({
      user: decode.user_create._id,
    });
    if (fromFollow == null) {
      fromFollow = new Follower({ user: decode.user_create._id });
    }

    console.log(fromFollow);

    return res.status(200).json({
      success: true,
      fromFollow,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err,
    });
  }
});

module.exports = router;
