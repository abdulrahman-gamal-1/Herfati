const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    // 'artisan' can list products and open funding campaigns
    // 'buyer' can purchase products and back campaigns
    role: { type: String, enum: ['artisan', 'buyer', 'admin'], default: 'buyer' },
    // Artisan-specific profile info (ignored for buyers)
    craft: { type: String, trim: true }, // e.g. نسيج، فخار، جلود
    region: { type: String, trim: true }, // governorate / country
    bio: { type: String, trim: true },
  },
  { timestamps: true }
);

// Hash the password automatically whenever it is set/changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
