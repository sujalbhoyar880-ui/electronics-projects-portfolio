// src/App.jsx
import "./App.css";

import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import AddProject from "./pages/AddProject";
import AdminProjects from "./pages/AdminProjects";
import EditProject from "./pages/EditProject";

import PaymentSuccess from "./pages/PaymentSuccess";
import AdminPayments from "./pages/AdminPayments";

import Login from "./components/Login";
import Register from "./components/Register";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import AdminLayout from "./layout/AdminLayout";

const ADMIN_EMAIL = "sujalbhoyar880@gmail.com";

function AppInner() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (!authChecked) {
    return (
      <div className="app-root" style={{ color: "#0ff", padding: 40 }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-root">
      {!isAdminPath && <Navbar user={user} />}

      <main className="app-main">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/project/:id"
            element={<ProjectDetails user={user} />}
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="add-project" element={<AddProject />} />
            <Route path="all-projects" element={<AdminProjects />} />
            <Route path="edit/:id" element={<EditProject />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
