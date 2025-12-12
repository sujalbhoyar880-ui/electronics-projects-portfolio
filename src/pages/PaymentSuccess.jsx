// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const projectId = params.get("projectId");
  const paymentId = params.get("paymentId");
  const [project, setProject] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!projectId) return;
      const snap = await getDoc(doc(db, "projects", projectId));
      if (snap.exists()) setProject(snap.data());
    };
    load();
  }, [projectId]);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "700px",
        margin: "0 auto",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1>Payment Successful 🎉</h1>
      {paymentId && <p>Payment ID: {paymentId}</p>}

      {project && (
        <>
          <h2 style={{ marginTop: "20px" }}>{project.title}</h2>
          <p>You can now download the project code.</p>
          {project.fileURL && (
            <a
              href={project.fileURL}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "20px",
                background: "#00eaff",
                padding: "12px 18px",
                borderRadius: "8px",
                color: "#000",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Download Code
            </a>
          )}
        </>
      )}

      <div style={{ marginTop: "30px" }}>
        <Link to="/projects" style={{ color: "#00eaff" }}>
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
