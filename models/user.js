const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema.....

const UserSchema = mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {

    //Use the mongoose function find by id....
    User.findById(id, callback);

}

module.exports.getUserByUsername = function(username, callback) {

    const query = { username: username }
    //Use the mongoose function find by username....
    User.findOne(query, callback);

}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
                console.log('Some error while hashing');
            } else {
                newUser.password = hash;
                newUser.save(callback);
            }

        });
    });
}