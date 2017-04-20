"use strict";


const express       = require('express');
const loginRoutes  = express.Router();

module.exports = function(UserHelpers) {
  loginRoutes.post("/register", function(req,res) {
    req.app.locals.user = UserHelpers.createNewUser(req.body.name, req.body.handle, req.body.password);
    req.session.handle = req.app.locals.user.handle;
    res.status(200).send();
  })

  return loginRoutes;
}