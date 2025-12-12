// backend/server.js
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// ⚠️ For dev: allow your Vite URL
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// 🔐 YOUR TEST KEYS (from Razorpay dashboard)
const RAZORPAY_KEY_ID = "rzp_test_RjCP0j5NwZCDyJ"; // your test key id
const RAZORPAY_KEY_SECRET = "YOUR_TEST_KEY_SECRET_HERE"; // DO NOT EMPTY

// 1) Create Razorpay order
app.post("/create-order", async (req, res) => {
  try {
    const { amount, projectId, projectTitle } = req.body;

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount, // in paise
      currency: "INR",
      receipt: `order_${projectId}_${Date.now()}`,
    });

    return res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      projectId,
      projectTitle,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// 2) Verify payment signature (optional but recommended)
app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
