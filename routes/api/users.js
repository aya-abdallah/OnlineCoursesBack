const passport = require("passport");
const router = require("express").Router();
const auth = require("../auth");
const User = require("../../models/users");


//  add normal user
router.post("/", auth.optional, (req, res, next) => {

  const user = req.body;
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }
  if (user.email) {
    User.findOne({ email: user.email }).then((data) => {
      if (data) {
        res.send({ msg: "this mail is already exist, Please submit with another one." });
      } else {
        const finalUser = new User(user);
        finalUser.setPassword(user.password);
        return finalUser
          .save()
          .then(() => res.send({ msg: "created acount successfully." }));
      }
    })
  }
});

// add admin
router.post("/admin", auth.required, (req, res, next) => {
  console.log("body === ", req.body);
  const user = req.body;
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required"
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required"
      }
    });
  }
  user.isAdmin = 1;
  const finalAdmin = new User(user);

  finalAdmin.setPassword(user.password);

  return finalAdmin
    .save()
    .then(() => res.json({ user: finalAdmin.toAuthJSON() }));
});

//list users
router.get('/',auth.required, (req, res) => {
  User.find({ isAdmin: 0 }).then(users => res.json(users)).catch(err => res.json(err))
})

//disable user
router.put('/:id',auth.required, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      user.isActive = !user.isActive;
      user.save().then(user => res.json(user).catch(err => res.json(err)));
    }).catch(err => res.json(err));
})

//  user login
router.post("/login", auth.optional, (req, res, next) => {
  const user = req.body;

  if (!user.email) {
    return res.json({
      errors: {
        email: " is required"
      }
    });
  }

  if (!user.password) {
    return res.json({
      errors: {
        password: " is required"
      }
    });
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        res.cookie('userId', user._id);
        if (user.isActive === false) {
          return res.json({
            errors: " this acount is disactive"
          });
        }
        return res.json({ user: user.toAuthJSON() });
      }
      return res.json({
        errors: " Invalid email or password"
      });
    }
  )(req, res, next);
});

// get current user 
router.get("/current", auth.required, (req, res, next) => {
  const {
    payload: { id }
  } = req;

  return User.findById(id).then(user => {
    if (!user) {
      return res.sendStatus(400);
    }

    return res.json({ user: user.toAuthJSON() });
  });
});

module.exports = router;