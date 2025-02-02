const mongoose = require('mongoose');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');

const userController = {};

userController.verifyUser = (req, res, next) => {
  const { password, username } = req.body;
  console.log('inside verifyUser');
  User.findOne({ username: `${username}` }).then((doc) => {
    // if username doesn't exist, send them to sign up
    if (!doc) {
      return res.redirect('/signup');
    }
    // check password
    bcrypt
      .compare(password, doc.password)
      .then((result) => {
        if (!result) {
          console.log('incorrect username or password');
          return res.redirect('/');
        } else {
          res.locals.userID = doc._id;
          // console.log('should log ID :', doc._id);
          return next();
        }
      })
      .catch((err) => {
        return next({
          log: 'Caught error while verifying password in verifyUser middleware',
          status: 400,
          message: { err: 'An unknown error occured.' },
        });
      })
      .catch((err) => {
        return next({
          log: 'Caught error while verifying username in verifyUser middleware',
          status: 400,
          message: { err: 'An unknown error occured.' },
        });
      });
  });
};

// Create a new user in the database
userController.createUser = (req, res, next) => {
  // console.log('req.body :', req.body);
  const { username, password, name, parksVisited } = req.body;

  User.create({ username, password, name, parksVisited: {} })
    .then((user) => {
      res.locals.newUser = user;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

// Get user info
userController.getUser = (req, res, next) => {
  // console.log(req.cookies);
  const { ssid } = req.cookies;

  User.findOne({ _id: ssid })
    .then((userData) => {
      // console.log(JSON.stringify(userData, null))
      res.locals.userData = userData; // <-- send back all user data
      return next();
    })
    .catch((err) => {
      // console.log('User not found');
      return next({ message: 'Error in getUser' });
    });
};

// Add a park to a user's completed parks
userController.addPark = (req, res, next) => {
  const { ssid } = req.cookies;
  User.findOneAndUpdate({ _id: ssid }, { parksVisited: req.body })
    .then((user) => {
      res.locals.park = user;
      return next();
    })
    .catch((err) => next(err));
};
//   console.log('addPark controller accessed');
//   try {
//     const parkCode = req.params.parkCode;
//     console.log(req.body);

//     const newPark = {
//       visitsArr: [{ date: req.body.date, notes: req.body.notes }],
//       activitiesCompleted: req.body.activitiesDone,
//     };

//     const user = await User.findOne({ name: req.body.username });
//     if (username) {
//       const parksVisited = { ...user.parksVisited, [parkCode]: newPark };
//       user.parksVisited = parksVisited;
//       const newUser = await user.save();
//       console.log('newuser :', newUser);
//     }
//     res.locals.park = user.parksVisited[parkCode]; // <-- send back the newly added park's info
//     return next();
//   } catch (err) {
//     return next({ err: 'cannot add park, user not found' });
//   }
// };

// Get parks completed array for icon coloring on landing page
// userController.getParks = (req, res, next) => {
//   console.log(req.cookies);
//   const { ssid } = req.cookies;

//   User.findOne({ _id: ssid })
//     .then((userData) => {
//       res.locals.parks = Object.keys(userData.parksVisited); // <-- send back array of parks completed
//       return next();
//     })
//     .catch((err) => {
//       return next({ message: 'Error in getParks' });
//     });
// };

// Get user's park-specific info for top of modal display
// userController.getParkInfo = (req, res, next) => {
//   try {
//     // console.log(req.params);
//     const { parkCode } = req.params;
//     const { parksVisited } = res.locals.user;
//     // console.log(parkCode);
//     console.log('parks visited :', parksVisited);
//     res.locals.parkInfo = parksVisited[parkCode];
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// };

module.exports = userController;
