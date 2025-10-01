const { Brand } = require("../model/brand");

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().exec();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
