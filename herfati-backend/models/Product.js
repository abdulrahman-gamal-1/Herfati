const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true }, // نسيج، فخار، جلود، خشب...
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 1 },
    images: [{ type: String }], // image URLs
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
