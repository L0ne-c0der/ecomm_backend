const { User } = require("../model/user");

// exports.createUser = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     user
//       .save()
//       .then((savedUser) => {
//         res.status(201).json(savedUser);
//       })
//       .catch((error) => {
//         res.status(400).json({ error: error.message });
//       });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, email: 1, name: 1 }).exec();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email id addresses")
      .populate({
        path: "addresses",
        // optionally limit returned fields, e.g.:
        // select: "street city state zip -_id"
      })
      .exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  //updates User document's fields
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
