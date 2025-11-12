require("dotenv").config();
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const server = express();
const mongoose = require("mongoose");
const User = require("./model/user");
const session = require("express-session");
const productRouter = require("./routes/Products");
const categoryRouter = require("./routes/Categories");
const brandRouter = require("./routes/Brands");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auths");
const adminOrderRouter = require("./routes/adminOrders");
const cors = require("cors");
const initPassport = require("./config/passport");

// Middleware

server.use(express.json()); //to parse req.body
server.use(
  cors({
    origin: true, // frontend origin — must be exact
    credentials: true, // allow cookies/credentials
  })
); //to allow cross-origin requests
server.use(express.urlencoded({ extended: true }));

// Passport and session setup
server.use(
  session({
    secret: process.env.SESSION_SECRET || "hello kitty",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      secure: false, // set true in production when using HTTPS
      sameSite: "lax",
    },
    // store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }), // need to use connectMongo for this
  })
);

initPassport(passport);

server.use(passport.initialize());
console.log("passport.initialize() called");

server.use(passport.authenticate("session")); // restores req.user from session using serialiize/deserialize logic
console.log("passport session middleware mounted");

// server.use(passport.session());

// Routes
server.use((req, res, next) => {
  console.log("🍪 Session ID:", req.sessionID);
  console.log("📦 Session object:", req.session);
  next();
});
server.use("/products", productRouter.router); // Use the product router
server.use("/categories", categoryRouter.router); // Use the category router
server.use("/brands", brandRouter.router); // Use the brand router
server.use("/orders", adminOrderRouter.router); // Use the admin order router
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);

main();
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

server.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

server.get("/protected", ensureAuthenticated, (req, res) => {
  console.log("🟢 Access granted to:", req.user.email);
  res.json({ message: "You are authenticated!", user: req.user });
});
