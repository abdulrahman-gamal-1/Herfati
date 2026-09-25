const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    story: { type: String, required: true, trim: true },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'funded', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
