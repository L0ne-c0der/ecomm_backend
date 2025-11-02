const mongoose = require("mongoose");
const { User } = require("../model/user");
const { Address } = require("../model/address");

// TO DO: Remove redundant write operations to User collection
exports.createAddress = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();
    const userId = req.params.userId;

    //checking if user exists
    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ error: "User not found" });

    const address = await Address.create(
      { ...req.body, userId } //,
      // { session }
    );

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { addresses: address.id } } //,
      // { session }
    );

    // await session.commitTransaction();
    // session.endSession();

    const addressData = address.toObject();
    delete addressData.userId;
    res.status(201).json(addressData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId }).exec();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).exec();
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  //updates User document's fields
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).exec();
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  // const session = await mongoose.startSession();
  try {
    // session.startTransaction();
    const userId = req.params.userId;
    const addressId = req.params.id;
    const deletedAddress = await Address.findByIdAndDelete(
      addressId //{
      // session,}
    ).exec();
    await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: addressId } }
      // { session }
    );
    // await session.commitTransaction();
    // session.endSession();
    res
      .status(200)
      .json({ id: addressId, message: "Address deleted successfully" });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    res.status(500).json({ error: error.message });
  }
};
