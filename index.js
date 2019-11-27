const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const keys = require('./config/keys');
const cors = require("cors")
const JwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const mogoURL =
  process.env.URL ||
  "mongodb+srv://aya:aya123@mycluster-rjzla.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(
  mogoURL,
  {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (!err) {
      console.log("started mongodb connection");
    }
  }
);

require('./models/users');
require('./config/passport');

app.use(
  session({
    secret: "passport",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);
app.use('/uploads', express.static('uploads'));

app.use(passport.initialize());
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(require('./routes'));
const opt = {
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
}

passport.use(new JwtStrategy(opt, (payload, done) => {

  User.findById(payload._id)
    .then(user => {
      if (user) {
        return done(null, user);
      }
      else {
        return done(null, false)
      }
    })
    .catch(err => {
      console.log(err);
    });

}));
app.listen(port, () => {
  console.log("listen to port 3000 ...");
});