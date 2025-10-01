const { Category } = require("../model/category");

exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().exec();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
