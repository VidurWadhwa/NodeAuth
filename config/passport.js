var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');

module.exports = function(passport) {

    let options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeader();
    options.secretOrKey = config.secret;
    //jwt strategy uses the jwt token provided by the client in the header of the request and uses it to generate the payload 
    //Structure of the payload give us the way to extract the id of the user
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {

        console.log('PAYLOAD IS:  ' + JSON.stringify(jwt_payload));
        User.getUserById(jwt_payload._doc._id, function(err, user) {
            if (err) {
                console.log('Some error while using the token: ' + err);
                return done(err, false)
            }
            if (user) {
                console.log('Got the user' + user);
                return done(null, user);
            } else {
                console.log('no user');
                return done(null, false);
            }
        });

    }));
}