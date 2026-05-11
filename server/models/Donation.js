const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR' },
    causeId: { type: String, default: '' },
    causeName: { type: String, default: 'RaiseIt Platform Support' },
    status: {
      type: String,
      enum: ['created', 'verified', 'failed'],
      default: 'created',
    },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    failureReason: { type: String, default: '' },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
