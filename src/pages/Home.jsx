// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        <div>
          <h1 style={{ fontSize: 40, marginBottom: 10 }}>
            Electronics Hub
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 520 }}>
            Explore detailed electronics projects — components, theory, circuit
            diagrams, and step-by-step procedures. Project code PDFs are paid
            and instantly available after secure Razorpay payment.
          </p>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <Link to="/projects" className="btn-primary" style={{ textDecoration: "none" }}>
              Browse Projects
            </Link>
            <Link to="/login" className="btn-outline" style={{ textDecoration: "none" }}>
              Login / Sign Up
            </Link>
          </div>
        </div>

        <img
          src="/logo.png"
          alt="Electronics Hub Logo"
          style={{
            width: 220,
            height: 220,
            borderRadius: 28,
            boxShadow: "0 0 40px rgba(0,229,255,0.6)",
          }}
        />
      </div>

      <hr style={{ borderColor: "#111827" }} />
      <h2 style={{ marginTop: 24 }}>What you get:</h2>
      <ul style={{ color: "#9ca3af", lineHeight: 1.8 }}>
        <li>✔ Components list with proper values</li>
        <li>✔ Project theory and working explanation</li>
        <li>✔ Circuit diagram and hardware connections</li>
        <li>✔ Step-by-step procedure</li>
        <li>✔ Paid downloadable code PDF (after payment)</li>
      </ul>
    </div>
  );
};

export default Home;
