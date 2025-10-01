const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
});

const virtual = categorySchema.virtual("id");

virtual.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
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

exports.Category = mongoose.model("Category", categorySchema);
