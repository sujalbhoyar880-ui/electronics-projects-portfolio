// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid #111827",
        padding: "16px 24px",
        textAlign: "center",
        fontSize: 12,
        color: "#6b7280",
        background: "#020617",
      }}
    >
      © {new Date().getFullYear()} Electronics Hub. All rights reserved.
    </footer>
  );
};

export default Footer;
