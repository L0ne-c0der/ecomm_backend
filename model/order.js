const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  totalItems: { type: Number, required: true, min: 0 },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "dispatched", "delivered", "cancelled"],
    default: "pending",
  },
  selectedAddress: {
    type: Schema.Types.ObjectId,
    ref: "Addresses",
    required: true,
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ["cash", "card", "credit_card", "paypal", "bank_transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
});

const virtual = orderSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
