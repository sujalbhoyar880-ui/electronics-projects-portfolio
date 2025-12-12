// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";

const Sidebar = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmenuToggle = () => {
    setSubmenuOpen(!submenuOpen);
    const audio = new Audio("/mnt/data/hover-sound.mp3");
    audio.play();
  };

  const handleCollapseToggle = () => setCollapsed(!collapsed);

const menuItems = [
  {
    label: "Home",
    icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    link: "/"
  },
  {
    label: "All Projects",
    icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z",
    link: "/projects"
  },
  {
    label: "Upload Project",
    icon: "M5 20h14v-2H5v2zm7-18l-5 5h3v4h4v-4h3l-5-5z",
    link: "/admin/add-project"
  },
  {
    label: "Account",
    icon: "M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z",
    link: "/profile"
  },
{
  label: "GitHub",
  iconComponent: <FaGithub size={22} style={{ color: "#0ff", filter: "drop-shadow(0 0 5px #0ff)" }} />,
  external: "https://github.com/"
},
{
  label: "Instagram",
  iconComponent: <FaInstagram size={22} style={{ color: "#0ff", filter: "drop-shadow(0 0 5px #0ff)" }} />,
  external: "https://instagram.com/"
},

  {
    label: "Manage Projects",
    icon: "...",
    link: "/admin/all-projects"
  },

  {
    label: "Payments",
    icon: "...",
    link: "/admin/payments"
  }
];


  return (
    <div
      style={{
        width: collapsed ? "70px" : "260px",
        background: "#111",
        position: "fixed",
        top: 0,
        left: mounted ? 0 : "-260px",
        transition: "width 0.3s ease, left 0.4s ease",
        height: "100vh",
        padding: "20px 10px",
        borderRight: "2px solid #0ff",
        boxShadow: "0 0 30px #0ff",
        zIndex: 999,
      }}
    >

      {/* Collapse Button */}
      <div
        style={{
          cursor: "pointer",
          color: "#0ff",
          fontSize: "1.4rem",
          marginBottom: "30px",
          textAlign: collapsed ? "center" : "right",
        }}
        onClick={handleCollapseToggle}
      >
        {collapsed ? "➡️" : "⬅️"}
      </div>

      {/* Profile (visible only when expanded) */}
      {!collapsed && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img
            src="/mnt/data/w.JPG"
            alt="owner"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "3px solid #0ff",
              boxShadow: "0 0 20px #0ff",
              objectFit: "cover",
            }}
          />
          <h3 style={{ marginTop: 15, color: "#0ff", textShadow: "0 0 10px #0ff" }}>
            Owner
          </h3>
        </div>
      )}

      {/* Menu List */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {menuItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: "10px" }}>
              {/* INTERNAL LINK */}
              {item.link && (
                <Link
                  to={item.link}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 12,
                    padding: "10px",
                    borderRadius: 6,
                    color: "#0ff",
                    textDecoration: "none",
                    background: "transparent",
                    transition: "0.2s",
                    textShadow: "0 0 6px #0ff",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="#0ff"
                    style={{ filter: "drop-shadow(0 0 5px #0ff)" }}
                  >
                    <path d={item.icon} />
                  </svg>

                  {!collapsed && item.label}
                </Link>
              )}

              {/* EXTERNAL LINK */}
              {item.external && (
                <a
                  href={item.external}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : 12,
                    padding: "10px",
                    borderRadius: 6,
                    color: "#0ff",
                    textDecoration: "none",
                    textShadow: "0 0 6px #0ff",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0ff">
                    <path d={item.icon} />
                  </svg>
                  {!collapsed && item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;
