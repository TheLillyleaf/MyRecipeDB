const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const user = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({ message: "user created", result: result });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
});

router.post("/login", (req, res, next) => {
  //Looks for user,
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        throw new error("user not found!");
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "wrong password!" });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "secret_phrase_that_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Authentication successful!",
        token: token,
        expiresIn: 3600,
        userId: fetchedUser.username,
      });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(401)
        .json({ message: "Authentication failed!", error: err });
    });
});
module.exports = router;
