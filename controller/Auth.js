const { User } = require("../model/user");

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    user
      .save()
      .then((savedUser) => {
        const userObj = savedUser.toObject();
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
    const user = await User.findOne(
      { email: req.body.email },
      "id name email password addresses"
    )
      .populate({
        path: "addresses",
        // optionally limit returned fields, e.g.:
        // select: "street city state zip -_id"
      })
      .exec();
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    if (user.password === req.body.password) {
      const userObj = user.toObject();
      userObj.id = userObj._id;
      delete userObj._id;
      delete userObj.password;
      res.status(200).json(userObj);
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
