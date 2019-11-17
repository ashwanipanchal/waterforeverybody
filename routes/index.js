const express = require('express');
const passport = require('passport');
const router = express.Router();
const Merchant = require('../models/Merchant');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/merauth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

router.get('/merchant', (req, res)=> res.render('merlogin'))
router.get('/register', (req, res)=> res.render('merreg'))

// Register
router.post('/register', (req, res) => {
  const { bustitle, name, email, password, password2 } = req.body;
  let errors = [];

  if (!bustitle || !name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      bustitle,
      name,
      email,
      password,
      password2
    });
  } else {
    Merchant.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          bustitle,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Merchant({
          bustitle,
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/merchant');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/merchant_dashboard',
    failureRedirect: '/merchant',
    failureFlash: true
  })(req, res, next);
});

router.get('/merchant_dashboard', ensureAuthenticated, (req, res) =>
  res.render('merchant_dashboard', {
    user: req.user
  })
);

module.exports = router;