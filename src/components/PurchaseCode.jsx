// src/components/PurchaseCode.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const PurchaseCode = ({ userEmail, projectName, price }) => {
  const [loading, setLoading] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState("");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!userEmail) {
      alert("Please login to buy the code.");
      return;
    }
    if (!price || price <= 0) {
      alert("Invalid price.");
      return;
    }
    if (!window.Razorpay) {
      alert("Razorpay not loaded. Refresh the page.");
      return;
    }

    setLoading(true);
    try {
      // create order on backend
      const { data } = await axios.post("http://localhost:5000/api/createOrder", {
        amount: price,
        userEmail,
        projectName,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Electronics Hub",
        description: `Code for ${projectName}`,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              "http://localhost:5000/api/verifyPayment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: price,
                userEmail,
                projectName,
              }
            );

            if (verify.data.success) {
              setPurchaseCode(verify.data.code);
              alert("Payment successful! Your purchase code is shown below.");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment.");
          }
        },
        prefill: { email: userEmail },
        theme: { color: "#00e5ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error creating order.");
    }
    setLoading(false);
  };

  return (
    <div>
      <p style={{ fontSize: 14, color: "#9ca3af" }}>
        Full project code PDF is paid. Amount: <b>₹{price}</b>
      </p>
      <button
        className="btn-primary"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${price} & Get Code`}
      </button>

      {purchaseCode && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 8,
            background: "#022c22",
            border: "1px solid #16a34a",
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Your Purchase Code:</div>
          <code>{purchaseCode}</code>
        </div>
      )}
    </div>
  );
};

export default PurchaseCode;
