const { User } = require("../model/user");
const bcrypt = require("bcryptjs");

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
  res.json({
    message: "Login successful",
    user: { id: req.user.id, role: req.user.role },
  });
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    console.log("User logged out successfully");
    res.json({ message: "Logout successful" });
  });
};
