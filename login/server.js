var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var crypto = require('crypto');
var csrf = require('csurf')

// setup route middlewares
//var csrfProtection = csrf({ cookie: true });

// invoke an instance of express application.
var app = express();

// set our application port
app.set('port', 3000);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// use csufr
app.use(csrf({
		cookie: true, // Determines if the token secret for the user should be stored in a cookie or in req.session. Defaults to false.
		httpOnly: false // flags the cookie to be accessible only by the web server (defaults to false)
	}
));

// initialize user
var users = [{"username" : "sheikh"}];

app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*");
  next();
});

var sessionSecret = crypto.randomBytes(48).toString('hex');

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: sessionSecret, // This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
		httpOnly: true // if true, cookies can't be accessed from non HTML (i.e. JavaScript)
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/home');
    } else {
        next();
    }    
};

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});

// route for user signup
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/home');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/login.html');
    })
    .post((req, res) => {
        var username = req.body.username, password = req.body.password;

		var userExist = false;
		for (var user in users) {
			if(users[user].username == username) {
				userExist = true;
				console.log("User " + username + " exists");
				break;
			}
		}
		if (!userExist) {
			res.redirect('/login');
		} else {
			req.session.user = username;
			res.redirect('/home');
		}
	});


// route for user's dashboard
app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.sendFile(__dirname + '/home.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/user', (req, res) => {
	var username = req.body.username;
	users.push({"username" : username});
	console.log("User " + username + " added.");
});


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for attack page
app.get('/attack', (req, res) => {
	res.sendFile(__dirname + '/attack.html');
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
