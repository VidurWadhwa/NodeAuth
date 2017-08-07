var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var users = require('./routes/users');
const config = require('./config/database');

mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to db');
	}
});

var app = express();

//app.use(cors);

//Set up the static folder

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const port = 3000;

app.use('/users', users);

app.listen(port, function() {
    console.log('Listening to port 3000');
});