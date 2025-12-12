// src/components/Login.jsx
import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to home or admin
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, githubProvider);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle, #02101f, #000)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "350px",
          background: "rgba(0, 10, 20, 0.6)",
          borderRadius: "12px",
          padding: "30px",
          border: "1px solid #00eaff",
          boxShadow: "0 0 20px #00eaff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: "#00eaff",
            textShadow: "0 0 10px #00eaff",
          }}
        >
          Login
        </h2>

        {error && (
          <div
            style={{
              background: "rgba(255,0,0,0.1)",
              border: "1px solid red",
              color: "red",
              padding: 8,
              borderRadius: 6,
              marginBottom: 10,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* Email Input */}
        <label style={{ color: "#00eaff", fontSize: 14 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: 6,
            marginBottom: 15,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid #00eaff",
            borderRadius: 5,
            color: "#fff",
          }}
        />

        {/* Password Input */}
        <label style={{ color: "#00eaff", fontSize: 14 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: 6,
            marginBottom: 20,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid #00eaff",
            borderRadius: 5,
            color: "#fff",
          }}
        />

        {/* Login Button */}
        <button
          onClick={handleEmailLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#00eaff",
            color: "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 10px #00eaff",
            marginBottom: 15,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login with Email"}
        </button>

        <hr style={{ borderColor: "#003b4f", margin: "20px 0" }} />

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* GitHub Button */}
        <button
          onClick={handleGithubLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "#000",
            color: "#fff",
            border: "1px solid #fff",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <FaGithub />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
