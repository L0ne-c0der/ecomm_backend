const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../model/user");
const bcrypt = require("bcryptjs");

function initPassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function (
      email,
      password,
      done
    ) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("No user found with email:", email);
          return done(null, false, { message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("Password mismatch for user:", email);
          return done(null, false, { message: "Invalid credentials" });
        }
        console.log("Authentication successful for user:", email);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, user.id);
    });
  });

  passport.deserializeUser(async function (id, done) {
    process.nextTick(async function () {
      const user = await User.findById(id);
      console.log("Deserialized user:", user);
      return done(null, user);
    });
  });
}

module.exports = initPassport;
