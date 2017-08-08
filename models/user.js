const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema or the way documents will be stored in mongodb.......
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

//Adding model to the schema so that a new collection can be made in the database with the name of the model pluralised...
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {

    //Use the mongoose function find by id....
    User.findById(id, callback);

}

//Callback includes err and user if query is successful........
module.exports.getUserByUsername = function(username, callback) {

    const query = { username: username }
    //Use the mongoose function find by username....
    User.findOne(query, callback);

}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            console.log('Salt could not be generated');
        } else {
        	console.log('Salt generated successfuly: ' + salt);
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) {
                    console.log('Some error while hashing');
                } else {
                    console.log('Hash for user: ' + hash);
                    newUser.password = hash;
                    //Save method to save to the database......
                    newUser.save(callback);
                }

            });
        }

    });
}

module.exports.comparePass = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) {
            console.log('Some error occured while comparing: ' + err);
            throw err;
        } else {
            callback(null, isMatch);
        }
    });
}