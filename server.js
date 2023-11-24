const path = require("path");
const dotenv = require('dotenv');
const express= require("express")
const bcrypt = require('bcrypt');

dotenv.config();
// const app = require('./app');
const  {connectToMongo}  = require("./db/config.js");
const passport = require('passport');


// const port = process.env.PORT || 3001;

// dotenv.config({path:'./config.env'});
// const  {connectToMongo}  = require("./db/config.js");
// google auth
const cookieSession = require('express-session');
// const passport = require("passport");
const GoogleauthRoute = require('./routes/Googleauth.js');
const GitHubauthRoute = require('./routes/GitHubauthRoute.js');
// end

const authRouter = require('./routes/authRoutes.js');
const collegeRouter = require('./routes/collegeList.js');
const topCourseRouter = require('./routes/topCourse.js');
const scholarshipRouter = require('./routes/scholarship.js')



const app = express();
app.use(express.json());
var cors = require('cors');


const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))


app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended: false}));


// for google auth
app.use(
    cookieSession({
      secret: "adatein adatein kaisi h tu batade",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  
// Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/auth", GoogleauthRoute);
  app.use("/auth", GitHubauthRoute);

// end

app.use('/authentication', authRouter);
app.use('/college', collegeRouter);
app.use('/topCourse' ,topCourseRouter)
app.use('/scholarship',scholarshipRouter)


let db;

connectToMongo((err, database) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    db = database;

});

app.get('/auth/login', async(req,res) => res.render("login"));

app.get('/college', async (req, res) => 
    res.render("homepage")
);

app.post('/home', async (req, res) => {
     if (req.session && req.session.email) {
          const users = db.collection('users');
          const user = await users.findOne({ email: req.session.email });

          if (user.accessLevel === 'superadmin'){

                    res.send(`You are logged in as Superadmin: ${req.session.email}`);
          } 

          else if(user.accessLevel === 'subadmin') {
               
               res.send(`You are logged in as Subadmin: ${req.session.email}`);

          } 
          
          else{
               
               res.send(`You are logged in as Normal user: ${req.session.email}`);

          }
     } 
     else{
          res.send('Hello');
     }
});


app.post('/normal/login', async (req, res) => {

    const users = db.collection('users');
    const user = await users.findOne({ email: req.body.email });
    if (!user) {
          res.send('That email does not exist');
          return;
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (passwordMatch) {
          if (user.verified) {
               req.session.email = req.body.email;

               res.send('Login successfull');
               if (user.accessLevel === 'superadmin') {
                    res.send('Superadmin logged in');

               } else if (user.accessLevel === 'subadmin') {
                    res.send('Subadmin logged in');

               } else {
                    res.send('Normal user logged in');

               }
          } 
          else{
               res.send('Please verify your email first');
          }
     }
    else {
          res.send('Invalid password');
    }

});

app.get('/logout', async (req, res) => {
     req.session.destroy(() => {
          res.redirect('/');
     });
});

app.get('/',(req,res)=>{
     res.send("Home Page");
})


//Microsoft authentication

var MICROSOFT_GRAPH_CLIENT_ID =process.env.CLIENT_ID_MICROSOFT;
var MICROSOFT_GRAPH_CLIENT_SECRET = process.env.CLIENT_SECRET_MICROSOFT;

const MicrosoftStrategy = require('passport-microsoft').Strategy;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
passport.serializeUser(function (user, done) {
     done(null, user);
   });
   
   passport.deserializeUser(function (obj, done) {
     done(null, obj);
   });

   passport.use(new MicrosoftStrategy({
     clientID: MICROSOFT_GRAPH_CLIENT_ID,
     clientSecret: MICROSOFT_GRAPH_CLIENT_SECRET,
     callbackURL: 'http://localhost:3000/auth/microsoft/callback',
     scope: ['user.read']
   },
   function (accessToken, refreshToken, profile, done) {
     // asynchronous verification, for effect...
     process.nextTick(function () {
   
       // To keep the example simple, the user's Microsoft Graph profile is returned to
       // represent the logged-in user. In a typical application, you would want
       // to associate the Microsoft account with a user record in your database,
       // and return that user instead.
       console.log(`Microsoft User Info:
       firstName:${profile.name.givenName}
       lastName:${profile.name.familyName}
       displayname:${profile.displayName}
       email:${profile.emails[0].value}
       `);
       return done(null, profile);
     });
   }
));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieSession({ 
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: true
   }));

app.get('/auth/microsoft',
   passport.authenticate('microsoft', {
     // Optionally add any authentication params here
     // prompt: 'select_account'
   }),
   // eslint-disable-next-line no-unused-vars
   function (req, res) {
     // The request will be redirected to Microsoft for authentication, so this
     // function will not be called.
   });
 
 // GET /auth/microsoft/callback
 //   Use passport.authenticate() as route middleware to authenticate the
 //   request.  If authentication fails, the user will be redirected back to the
 //   login page.  Otherwise, the primary route function function will be called,
 //   which, in this example, will redirect the user to the home page.
 app.get('/auth/microsoft/callback',
   passport.authenticate('microsoft', { failureRedirect: '/login' }),
   function (req, res) {
     res.redirect('/');
   });

function ensureAuthenticated(req, res, next) {
     if (req.isAuthenticated()) { return next(); }
     res.redirect('/login');
   }




const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log("Server running on port",port);
})