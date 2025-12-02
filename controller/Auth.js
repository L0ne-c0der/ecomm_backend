const { User } = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ password: hashed, ...rest });
    user
      .save()
      .then((savedUser) => {
        const userObj = savedUser.toObject();
        console.log("New user created:", userObj);
        delete userObj.password;
        res.status(201).json(userObj);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  // console.log("Logged in user (req.user):", req.user);
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    // ensure we can read hashed password even if schema uses select:false
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { sub: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    delete userObj.password;

    // Option A: send token in response body
    // res.status(200).json({ message: "Login successful", token, user: userObj });

    // Option B: set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      secure: false, // set true in production when using HTTPS
      sameSite: "lax",
    });
    res.status(200).json({ message: "Login successful", user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = (req, res) => {
  console.log("Logging out user...");
  if (req.session) {
    req.session.destroy(() => {
      res.json({ message: "Logout successful" });
    });
  } else {
    res.json({ message: "Logout successful" });
  }
};
