// src/layout/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617, #000)",
        color: "white",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Admin Content */}
      <div
        style={{
          marginLeft: "260px",       // Push content right of sidebar
          padding: "40px 60px",      // Better spacing
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "900px",       // Center form/pages
            margin: "auto",
            paddingTop: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
