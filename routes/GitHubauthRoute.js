const router = require("express").Router();
const passport = require("passport");
require('dotenv').config();
require('../passport');
const GitHubStrategy = require('passport-github2').Strategy;

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
  });

  module.exports = router;