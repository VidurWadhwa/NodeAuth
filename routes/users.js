const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//Get or post requests.....

//register route
router.post('/register', function(request, response) {
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    })

    User.addUser(newUser, function(err, user) {
        if (err) {
            console.log('Error during addUser: ' + err);
            response.send({
                success: false,
                msg: 'Check the console for error'
            });
        } else {
            console.log('success');
            response.send({
                success: true,
                msg: 'User added successfully'
            });
        }
    });
});

//authenticate route
router.get('/authenticate', function(request, response) {
    response.send('Authenticate user');
});

//profile route
router.get('/profile', function(request, response) {
    response.send('Profile');
});

module.exports = router;