const { User } = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });

    // create refresh token (high entropy) and store only its sha256 hash
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push({
      tokenHash: refreshTokenHash,
      createdAt: new Date(),
    });
    await user.save();

    const userObj = user.toObject();
    userObj.id = userObj._id;
    delete userObj._id;
    delete userObj.password;

    // set refresh token as httpOnly cookie; client uses accessToken for Authorization header
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: false, // set true in production when using HTTPS
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ message: "Login successful", user: userObj, accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    console.log("Refreshing access token");
    const token = req.cookies && req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // find user who owns this refresh token
    const user = await User.findOne({
      "refreshTokens.tokenHash": tokenHash,
    }).exec();
    if (!user) return res.status(403).json({ error: "Invalid refresh token" });

    // rotate: remove used token and issue a new refresh token
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newRefreshHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // do modifications in two steps to avoid "conflicting path" error
    await User.updateOne(
      { _id: user._id, "refreshTokens.tokenHash": tokenHash },
      { $pull: { refreshTokens: { tokenHash } } }
    ).exec();

    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          refreshTokens: { tokenHash: newRefreshHash, createdAt: new Date() },
        },
      }
    ).exec();

    // set rotated refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    });

    // issue new access token
    const accessToken = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    return res.json({ accessToken });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      // remove the refresh token hash from whichever user has it
      await User.updateOne(
        { "refreshTokens.tokenHash": tokenHash },
        { $pull: { refreshTokens: { tokenHash } } }
      ).exec();
    }
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
