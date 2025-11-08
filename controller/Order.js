const { Order } = require("../model/order");

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .select("-user")
      .populate("items.product")
      .exec();

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .select("-user")
      .populate("items.product selectedAddress")
      .exec();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.fetchAllOrders = async (req, res) => {
//   try{
//     const orders = await Order.find()
//       .populate("items.product selectedAddress user")
//       .exec();
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.fetchAllOrders = async (req, res) => {
  //orders?sort=-price(only one)&_page=1&_per_page=10

  //TO DO: implement query on discounted price, currently working on actual price
  try {
    let sort = {};
    if (req.query._sort) {
      sort = req.query._sort;
    }

    const page = parseInt(req.query._page) || 1;
    const perPage = parseInt(req.query._per_page) || 10;
    const skip = (page - 1) * perPage;

    // Get total count for pagination
    const items = await Order.countDocuments();
    const pages = Math.ceil(items / perPage);
    const last = pages;
    const prev = page > 1 ? page - 1 : null;
    const next = page < pages ? page + 1 : null;

    let query = Order.find()
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .populate("items.product")
      .populate("selectedAddress")
      .populate({ path: "user", select: "email name id" });

    const orders = await query.exec();

    res.status(200).json({
      first: 1,
      prev,
      next,
      last,
      pages,
      items,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    })
      .populate("items.product")
      .populate("selectedAddress")
      .populate({ path: "user", select: "email name id" })
      .exec();
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// May need to modify for soft delete based on requirements
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
