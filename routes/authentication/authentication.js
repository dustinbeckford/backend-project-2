require("dotenv").config()
const express = require("express");
const router = express.Router();
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("../../models"); // Adjust the path if necessary
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { CarOwners, Cars } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { cookieJwtAuth } = require("../../middleware/cookieJwtAuth");

const sessionStore = new SequelizeStore({
  db: db.sequelize,
});
router.use(
  session({
    secret: "keyboard cat", // Secret used to sign the session ID cookie
    store: sessionStore, // Store sessions in SequelizeStore
    resave: false, // Do not save sessions if no modifications were made
    proxy: true, // Trust the reverse proxy when determining the connection's IP address
  })
);
sessionStore.sync(); // Sync the session store with the database

// Configure Passport Local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Field name for the username in the request body
      passwordField: "password", // Field name for the password in the request body
    },

    async (username, password, done) => {
      try {
        // Find the user by username
        const userToFind = await CarOwners.findOne({
          where: {
            username: username,
          },
        });

        // Check if the user exists and compare the password
        if (!userToFind) {
          return done(null, false, {
            message: "Invalid username or password",
          });
        }
        const passwordMatch = await bcrypt.compare(
          password,
          userToFind.password
        );
        if (passwordMatch) {
          return done(null, userToFind?.dataValues); // CarOwners authenticated successfully {id:name,created}
        } else {
          return done(null, false, {
            message: "Invalid username or password",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});



// Deserialize user from session storage
passport.deserializeUser(async (id, done) => {
  try {
    const userToFind = await CarOwners.findOne({
      where: {
        id: id,
      },
    });
    done(null, userToFind);
  } catch (error) {
    done(error);
  }
});

// Initialize Passport and session middleware
router.use(passport.initialize());
router.use(passport.session());

// Custom middleware to authenticate requests
function authenticate(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  })(req, res, next);
}

router.post("/sign_up", async (req, res) => {
  const { username, password } = req.body;
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user with the hashed password
  const userToCreate = { username: username, password: hashedPassword };
  const newUser = await CarOwners.create(userToCreate);

  res.json({ message: `User successfully created with ID ${newUser.id}` });
});

// router.post("/login", authenticate, (req, res) => {
//   res.redirect("/login");
// });

router.get("/dashboard", async (req, res) => {
  try {
    const carsFromUserLoggedIn = await Cars.findAll({
      where: {
        ownerId: req.user.id,
      },
    });
    console.log(carsFromUserLoggedIn);
    res.render("./dashboard/dashboard", { cars: carsFromUserLoggedIn });
  } catch (error) {
    res.status(500).json({ error: "Failed to get cars" });
  }
});


// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const carOwner = await CarOwners.findOne({ where: { username: username } });
    if (carOwner) {
      console.log(carOwner.dataValues.password)
      const isPasswordValid = await bcrypt.compare(password, carOwner.dataValues.password);
      console.log(isPasswordValid)
      if (isPasswordValid) {
        console.log(process.env.MY_SECRET)
        // The important part
const token = jwt.sign(carOwner.dataValues, process.env.MY_SECRET, { expiresIn: "15m"});
        res.cookie("token", token, {
          httpOnly: true,
          //secure: true
          //maxAge: 100000,
          //signed: true
        });
        // Password is valid, perform login logic here
        // For example, you can create a session or generate a token
        // Then redirect the user to the dashboard
        res.redirect("/owner/dashboard");
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});


router.post('/logout', function(req, res,) {
  // remove the req.user property and clear the login session
  res.clearCookie("token")
  // redirect to login
  res.redirect('/login');
});

module.exports = router;
