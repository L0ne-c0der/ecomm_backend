const { Brand } = require("../model/brand");

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().exec();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.CreateBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    brand
      .save()
      .then((savedBrand) => {
        res.status(201).json(savedBrand);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
