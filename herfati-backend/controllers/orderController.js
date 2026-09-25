const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route POST /api/orders
// body: { items: [{ product: id, quantity }] }
const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('السلة فارغة');
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error(`منتج غير متاح: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`الكمية المطلوبة من "${product.name}" غير متوفرة`);
    }
    orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
    totalAmount += product.price * item.quantity;

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    totalAmount,
  });

  res.status(201).json(order);
});

// @route GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('items.product', 'name price images')
    .sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = { createOrder, getMyOrders };
