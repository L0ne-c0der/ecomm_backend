const mongoose = require("mongoose");
const { Schema } = mongoose;

addressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String }, // e.g. "home", "work"
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, default: "USA" },
    phone: { type: String },
  },
  { _id: true, versionKey: false } // ensure each address has its own _id for $pull / positional updates
);

const virtual = addressSchema.virtual("id");

virtual.get(function () {
  return this._id.toHexString();
});

const transformFn = function (doc, ret) {
  // ret.id = ret._id;
  delete ret._id;
  // return ret;
};

addressSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: transformFn,
});

addressSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: transformFn,
});

// acts as a hook to add address to user's addresses array after save
// will not work with insertMany and/or accross multiple instances
addressSchema.post("save", async function (doc, next) {
  try {
    const User = require("./user").User;
    await User.findByIdAndUpdate(doc.userId, {
      $addToSet: { addresses: doc._id },
    });
    next();
  } catch (err) {
    next(err);
  }
});

// when an address is removed via findOneAndDelete, pull it from user
// will not work with insertMany and/or accross multiple instances
addressSchema.post("findOneAndDelete", async function (doc, next) {
  if (!doc) return next();
  try {
    const User = require("./user").User;
    await User.findByIdAndUpdate(doc.userId, { $pull: { addresses: doc._id } });
    next();
  } catch (err) {
    next(err);
  }
});

exports.Address = mongoose.model("Addresses", addressSchema);
