// src/components/Register.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>

      <form onSubmit={register} style={{ maxWidth: 400 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
