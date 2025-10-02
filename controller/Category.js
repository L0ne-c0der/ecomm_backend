const { Category } = require("../model/category");

exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().exec();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.CreateCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    category
      .save()
      .then((savedCategory) => {
        res.status(201).json(savedCategory);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
