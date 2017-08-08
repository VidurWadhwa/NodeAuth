const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//Get or post requests.....

//register route
router.post('/register', function(request, response) {

    //Make an object with all the data in the request body
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    })
    //addUser method to add the newUser object to the db.....
    User.addUser(newUser, function(err, user) {
        if (err) {
            console.log('Error during addUser: ' + err);
            response.send({
                success: false,
                msg: 'Check the console for error'
            });
        } else {
            console.log('success');
            response.send(user);
        }
    });
});

//authenticate route
router.post('/authenticate', function(request, response) {
    const username = request.body.username;
    const password = request.body.password;

    //Querying for the user using the getUserByUsername method in the user.js file
    User.getUserByUsername(username, function(err, user) {
        if (err) {
            console.log('User could not be authenticated bcoz of: ' + err);
        }
        if (!user) {
            response.send({
                success: false,
                msg: 'User not found'
            });
        }

        //Comparing the password given by the client in the request body and that present in the db.....
        User.comparePass(password, user.password, function(err, isMatch) {
            if (err) {
                throw err;
            }
            //isMatch is true if the hash in the db and that given by the client(after hashing done in user.js) matches..... 
            if (isMatch) {
                //Get our token
                //This token is used to make login sessions
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 640800 //in seconds...
                })

                response.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return response.json({
                    success: false,
                    msg: 'Wrong password'
                })
            }
        });
    });
});

//This route will be protected that is user will need the above generated token to access this route......
//profile route

router.get('/profile', passport.authenticate('jwt', {session: false}), function(request, response) {
    response.send({user: request.user});
});


module.exports = router;