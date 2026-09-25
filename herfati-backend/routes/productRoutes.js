const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('artisan', 'admin'), createProduct);
router.put('/:id', protect, authorize('artisan', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('artisan', 'admin'), deleteProduct);

module.exports = router;
