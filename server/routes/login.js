"use strict";


const express       = require('express');
const loginRoutes  = express.Router();

module.exports = function(UserHelpers) {
  loginRoutes.post("/register", function(req, res) {
    const login = (err, user) => {
      req.app.locals.user = user;
      req.session.handle = req.app.locals.user.handle;
      res.redirect("/");
    }
    UserHelpers.createUser(req.body.name, `@${req.body.handle}`, req.body.password, login);
  })

  loginRoutes.post("/login", function(req, res) {
    const login = (err, user) => {
      if (err) {
        res.status(403).send();
      } else {
        req.app.locals.user = user;
        req.session.handle = req.app.locals.user.handle;
        res.redirect("/");
      }
    }
    UserHelpers.authenticate(`@${req.body.handle}`, req.body.password, login);
  });

  loginRoutes.get("/login", function(req, res) {
    if (req.session.handle) {
      UserHelpers.getUser(req.session.handle, (err, user) => {
        if (err) {
          res.status(403).send();
        } else {
          req.app.locals.user = user;
          res.status(200).send(user.handle);
        }
      })
    } else {
      res.status(200);
    }
  });

  loginRoutes.post("/logout", (req, res) => {
    req.session.handle = null;
    res.status(200).send();
  });
  return loginRoutes;
}