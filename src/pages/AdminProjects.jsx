// src/pages/AdminProjects.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);

  // Load all projects from Firestore
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "projects"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(list);
    };
    load();
  }, []);

  // Delete a project
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete project: ${title}?`)) return;

    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter((p) => p.id !== id));

    alert("Project deleted!");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", color: "white" }}>
      <h1 style={{ marginBottom: "30px" }}>Manage Projects</h1>

      {projects.length === 0 && <p>No projects found.</p>}

      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            padding: "20px",
            background: "#0a0f24",
            borderRadius: "10px",
            border: "1px solid #00eaff55",
            marginBottom: "20px",
            boxShadow: "0 0 14px rgba(0,255,255,0.15)",
          }}
        >
          <h2>{project.title}</h2>

          {project.imageURL && (
            <img
              src={project.imageURL}
              alt={project.title}
              style={{
                width: "180px",
                marginTop: "10px",
                borderRadius: "10px",
                boxShadow: "0 0 10px #00eaff",
                marginBottom: "10px",
              }}
            />
          )}

          <p style={{ color: "#bbb" }}>Price: ₹{project.price}</p>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            {/* EDIT BUTTON */}
            <Link
              to={`/admin/edit/${project.id}`}
              style={{
                background: "#00eaff",
                padding: "8px 14px",
                fontWeight: "bold",
                color: "#000",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Edit
            </Link>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(project.id, project.title)}
              style={{
                background: "#ff3b3b",
                padding: "8px 14px",
                fontWeight: "bold",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
