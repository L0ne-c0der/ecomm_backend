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

exports.fetchAllProducts = async (req, res) => {
  //filter= {"category": ["beauty", "laptops"], brand:[]}
  //sort= {_sort: "price"} stores only one value
  //pagination= {"_page": 1, "_per_page": 10}

  //products?category=beauty(only one, need to add more)&brand=apple&sort=-price(only one)&_page=1&_per_page=10

  try {
    let filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    let sort = {};
    if (req.query._sort) {
      sort = req.query._sort;
    }

    const page = parseInt(req.query._page) || 1;
    const perPage = parseInt(req.query._per_page) || 10;
    const skip = (page - 1) * perPage;

    // Get total count for pagination
    const items = await Product.countDocuments(filter);
    const pages = Math.ceil(items / perPage);
    const last = pages;
    const prev = page > 1 ? page - 1 : null;
    const next = page < pages ? page + 1 : null;

    let query = Product.find(filter).sort(sort).skip(skip).limit(perPage);

    const products = await query.exec();

    res.status(200).json({
      first: 1,
      prev,
      next,
      last,
      pages,
      items,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
