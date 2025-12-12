// src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        background:
          "radial-gradient(circle at top, #020617, #020617 60%, #000 100%)",
        border: "1px solid #111827",
        boxShadow: "0 0 16px rgba(15,23,42,0.8)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>{project.title}</h3>

      {project.categories && (
        <div style={{ marginBottom: 8 }}>
          {project.categories.map((cat) => (
            <span
              key={cat}
              style={{
                display: "inline-block",
                padding: "2px 8px",
                marginRight: 6,
                marginBottom: 4,
                borderRadius: 999,
                fontSize: 11,
                background: "#001e3c",
                color: "#00e5ff",
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

   {project.imageURL && (
  <img
    src={project.imageURL}
    alt={project.title}
    style={{
      width: "100%",
      height: 150,
      objectFit: "cover",
      borderRadius: 12,
      marginBottom: 10,
    }}
  />
)}


      <p style={{ fontSize: 13, color: "#9ca3af", minHeight: 30 }}>
        {project.shortDescription || "Complete project details and code."}
      </p>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600 }}>Code: ₹{project.price}</span>
        <Link
          to={`/project/${project.id}`}
          style={{ fontSize: 13, textDecoration: "none", color: "#00e5ff" }}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
