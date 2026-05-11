const express = require("express");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Donation = require("../models/Donation");
const Cause = require("../models/Cause");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");
const router = express.Router();

router.post("/create-order", optionalAuth, async (req, res) => {
  const { amount, currency = "INR", causeId = "", causeName = "RaiseIt Platform Support" } = req.body;
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: "Payments are not configured" });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ message: "A valid donation amount is required" });
    }

    let resolvedCauseName = causeName;
    if (causeId) {
      const cause = await Cause.findOne({ _id: causeId, active: true });
      if (!cause) return res.status(400).json({ message: "Selected cause is not available" });
      resolvedCauseName = cause.name;
    }

    const options = {
      amount: Math.round(numericAmount * 100),
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    await Donation.create({
      user: req.user?._id || null,
      amount: numericAmount,
      currency,
      causeId,
      causeName: resolvedCauseName,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

router.post("/verify", optionalAuth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Payment verification data is required" });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "failed", failureReason: "Invalid payment signature" }
    );
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  const donation = await Donation.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      user: req.user?._id || undefined,
      status: "verified",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verifiedAt: new Date(),
    },
    { new: true }
  );

  res.json({ status: "ok", donation });
});

router.get("/my-donations", optionalAuth, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Please log in to view donation history" });

  const donations = await Donation.find({ user: req.user._id, status: "verified" }).sort({ createdAt: -1 });
  res.json(donations);
});

module.exports = router;
