// verifyPayment.js
const express = require("express");
const crypto = require("crypto");
const admin = require("firebase-admin");
const fs = require("fs");
const router = express.Router();

// Firebase init
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync("firebase-service-account.json"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

router.post("/", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, userEmail, projectName } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body).digest("hex");

  if (expectedSignature === razorpay_signature) {
    const code = "CODE-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    await db.collection("purchaseCodes").add({
      code,
      amount,
      projectName,
      userEmail,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      createdAt: new Date(),
      used: false,
    });

    res.status(200).json({ success: true, code });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
