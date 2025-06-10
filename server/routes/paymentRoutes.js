const express = require("express");
const razorpay = require("../config/razorpay");
const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

router.post("/verify", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;