"use strict";

const bcrypt = require('bcrypt');
const {generateAvatars} = require('./util/avatar-helper');

module.exports = function makeUserHelpers(db) {
  return {
    getUser: (handle, cb) => {
      db.collection("users").find({ "user.handle": handle }).limit(1).next((err, user) => {
        if (user) {
          cb(null, user.user);
        } else {
          cb("user doesn't exist");
        }
      })
    },
    createUser: (name, handle, password, cb) => {
      db.collection("users").updateOne(
        { currentUserId: { $exists: true } },
        { $inc: { currentUserId: 1 } }
      );
      const user = {
        name: name,
        handle: handle,
        avatars: generateAvatars(handle)
      }
      db.collection("users").find({ currentUserId: { $exists: true } }).limit(1).next((err, userID) => {
        db.collection("users").insertOne({
          user: user,
          password: bcrypt.hashSync(password, 10),
          id:  userID,
          userSince: Date.now()
        });
        cb(null, user);
      });
    },

    authenticate: (handle, password, cb) => {
      db.collection("users").find({ "user.handle": handle }).limit(1).next((err, user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          cb(null, user.user);
        } else {
          cb("bad credentials", null);
        }
        return "test2";
      });

    }
  };
}