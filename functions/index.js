const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const RAZORPAY_KEY_ID = "rzp_test_RjCP0j5NwZCDyJ";
const RAZORPAY_KEY_SECRET = "eXeKsKNa4uKWnTu1V0UQtqCI";  // ← MUST NOT BE EMPTY

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required");
  }

  const { amount, projectId } = data;

  const order = await new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  }).orders.create({
    amount,
    currency: "INR",
    receipt: `order_${projectId}_${Date.now()}`
  });

  return { orderId: order.id, keyId: RAZORPAY_KEY_ID };
});

exports.verifyAndStorePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Login required");
  }

  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    projectId,
    projectTitle,
    amount
  } = data;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new functions.https.HttpsError("permission-denied", "Invalid signature");
  }

  await db.collection("payments").add({
    userId: context.auth.uid,
    email: context.auth.token.email,
    projectId,
    projectTitle,
    amount,
    razorpayOrderId,
    razorpayPaymentId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
