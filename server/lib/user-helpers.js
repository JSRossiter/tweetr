"use strict";

const bcrypt = require('bcrypt');
const {generateAvatars} = require('./utils/avatar-helper');

module.exports = function makeUserHelpers(db) {
  return {
    getUser: () => {
      return "jeffREY"
    },
    createUser: (name, handle, password) => {
      db.collection("users").updateOne(
        { currentUserId: { $exists: true } },
        { $inc: { currentUserId: 1 } }
      );
      const userID = db.collection("users").findOne({ currentUserId: { $exists: true } })
      const user = {
        name: name,
        handle: handle,
        avatars: generateAvatars(handle)
      }
      db.collection("users").insertOne(
        {
          user: user,
          password: bcrypt.hashSync(password, 10),
          id:  userID,
          userSince: Date.now()
        });
      return user;
    }
  };
}