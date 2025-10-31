const mongoose = require("mongoose");
const { Schema } = mongoose;
const Address = require("./address");

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
    addresses: [{ type: Schema.Types.ObjectId, ref: "Addresses", default: [] }],
    phone: { type: String, default: "", unique: true },
  },
  { versionKey: false }
);

const virtual = userSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // ret.id = ret._id;
    delete ret._id;
    // return ret;
  },
});

exports.User = mongoose.model("User", userSchema);
