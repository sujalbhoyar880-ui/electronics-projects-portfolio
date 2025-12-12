// createOrder.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/", async (req, res) => {
  const { amount, projectName, userEmail } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { project: projectName, user: userEmail },
    });
    res.status(200).json({ order, key: process.env.RAZORPAY_KEY });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

