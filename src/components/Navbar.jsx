// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Navbar = ({ user }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? { color: "#00e5ff" } : {};

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid #111827",
        background:
          "linear-gradient(90deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9))",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Logo + Brand */}
      <Link
        to="/"
        style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <img
          src="/logo.png"
          alt="Electronics Hub Logo"
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            marginRight: 10,
          }}
        />
        <span style={{ fontSize: 20, fontWeight: 700, color: "#e5e7eb" }}>
          Electronics Hub
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: 14,
            color: "#9ca3af",
            ...isActive("/"),
          }}
        >
          Home
        </Link>
        <Link
          to="/projects"
          style={{
            textDecoration: "none",
            fontSize: 14,
            color: "#9ca3af",
            ...isActive("/projects"),
          }}
        >
          Projects
        </Link>

        {user?.email === "Sujalbhoyar880@gmail.com" && (
          <Link
            to="/admin/add-project"
            style={{
              textDecoration: "none",
              fontSize: 14,
              color: "#22c55e",
            }}
          >
            + Add Project
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className="btn-outline"
              style={{ textDecoration: "none", fontSize: 14 }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary"
              style={{ textDecoration: "none", fontSize: 14 }}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="btn-outline"
              style={{ fontSize: 13 }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
