const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5, default: 0 },
  comment: String,
  date: Date,
  reviewerName: String,
  reviewerEmail: String,
});

const metaSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    barcode: String,
    qrCode: String,
  },
  { _id: false }
);

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true, min: [0, "wrong min price"] },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [100, "wrong max discount"],
  },
  rating: Number,
  stock: Number,
  tags: [String],
  brand: String,
  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String,
  reviews: [reviewSchema],
  returnPolicy: String,
  minimumOrderQuantity: Number,
  meta: metaSchema,
  images: [String],
  thumbnail: String,
});

const virtual = productSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // ret.id = ret._id;
    delete ret._id;
    // return ret;
  },
});
// virtual.get(function () {
//   return this._id.toHexString();
// });

exports.Product = mongoose.model("Product", productSchema);
