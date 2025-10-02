const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    // addresses: { type: [Schema.Types.Mixed], default: [] },
    //TO DO: add address schema
    phone: { type: String, default: "", unique: true },
  },
  { versionKey: false }
);

exports.User = mongoose.model("User", userSchema);
