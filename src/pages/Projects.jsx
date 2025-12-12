// src/pages/Projects.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "projects"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(list);
    };
    load();
  }, []);

  const categories = ["All", "ADAS", "IoT", "Sensor", "Arduino"];

  const filtered = projects.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ||
      (p.categories && p.categories.includes(activeCategory));

    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.components?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container">
      <h1>Projects</h1>

      {/* Filters */}
      <div
        style={{
          marginTop: 12,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background:
                activeCategory === cat ? "#00e5ff" : "rgba(15,23,42,0.9)",
              color: activeCategory === cat ? "#000" : "#e5e7eb",
              fontSize: 13,
            }}
          >
            {cat}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: 8,
            borderRadius: 999,
            border: "1px solid #374151",
            background: "#020617",
            color: "#e5e7eb",
          }}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 18,
        }}
      >
        {filtered.length === 0 && <p>No projects found.</p>}

        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
