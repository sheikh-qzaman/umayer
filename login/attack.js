var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var crypto = require('crypto');
//var User = require('./models/user');

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 3001);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/attack.html');
});

app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
