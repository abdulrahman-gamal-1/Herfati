const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @route GET /api/products
// Supports optional ?category=&search=&page=&limit= query params
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category && category !== 'الكل') filter.category = category;
  if (search) filter.$text = { $search: search };

  const products = await Product.find(filter)
    .populate('artisan', 'name region craft')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);
  res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('artisan', 'name region craft bio');
  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
  res.json(product);
});

// @route POST /api/products (artisan only)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock, images } = req.body;
  const product = await Product.create({
    artisan: req.user._id,
    name,
    description,
    category,
    price,
    stock,
    images,
  });
  res.status(201).json(product);
});

// @route PUT /api/products/:id (owning artisan only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
  if (product.artisan.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('لا يمكنك تعديل منتج ليس ملكك');
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @route DELETE /api/products/:id (owning artisan only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
  if (product.artisan.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('لا يمكنك حذف منتج ليس ملكك');
  }

  await product.deleteOne();
  res.json({ message: 'تم حذف المنتج' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
