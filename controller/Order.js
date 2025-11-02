const { Order } = require("../model/order");

// exports.fetchAllCarts = async (req, res) => {
//   try {
//     const carts = await Cart.find().exec();
//     res.status(200).json(carts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("items.product")
      .exec();

    res.status(201).json(populatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchUserCarts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const carts = await Cart.find({ user: userId })
      .populate("product quantity")
      .exec();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const updatedCart = await Cart.findByIdAndUpdate(cartId, req.body, {
      new: true,
    }).populate("product quantity");
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCartById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await Cart.deleteMany({ user: userId });
    res.status(200).json({ message: `${result.deletedCount} carts cleared.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
