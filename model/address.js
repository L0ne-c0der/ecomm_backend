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
  { _id: true } // ensure each address has its own _id for $pull / positional updates
);

exports.Address = mongoose.model("Addresses", addressSchema);
