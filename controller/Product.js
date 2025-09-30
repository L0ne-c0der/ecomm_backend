const { Product } = require("../model/product");

exports.CreateProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    product
      .save()
      .then((savedProduct) => {
        res.status(201).json(savedProduct);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
