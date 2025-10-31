const { Address } = require("../model/address");

exports.createAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.params.userId });
    address
      .save()
      .then((savedAddress) => {
        res.status(201).json(savedAddress);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchAllAddresses = async (req, res) => {
  try {
    console.log(req.params.userId);
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
  try {
    const addressId = req.params.id;
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
