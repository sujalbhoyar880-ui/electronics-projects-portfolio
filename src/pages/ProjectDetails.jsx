// src/pages/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const RAZORPAY_KEY_ID = "rzp_test_RjCP0j5NwZCDyJ"; // use your test key

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  // purchased = persisted purchase (in Firestore orders)
  const [purchased, setPurchased] = useState(false);
  // purchasedSession = temporary unlock for current session (no DB write)
  const [purchasedSession, setPurchasedSession] = useState(false);

  useEffect(() => {
    // fetch project and then check purchase if user logged in
    const fetchProjectAndCheck = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "projects", id));
        if (!snap.exists()) {
          setProject(null);
          return;
        }
        const data = snap.data();
        const validImage =
          (data.images || []).find((img) => img?.startsWith("http")) ||
          data.image ||
          "https://placehold.co/1000x400?text=No+Image";

        setProject({ ...data, mainImage: validImage });

        // check persisted purchase (if user logged in)
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            where("projectId", "==", id)
          );
          const snaps = await getDocs(q);
          if (!snaps.empty) setPurchased(true);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Razorpay payment handler — saves an order in Firestore if user logged in,
  // otherwise only unlocks for current session.
  const handleBuyNow = () => {
    if (!project) {
      alert("Project not loaded yet.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Check your index.html script tag.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Number(project.price || 0) * 100,
      currency: "INR",
      name: "Electronics Hub",
      description: project.title || "Project Purchase",
      handler: async function (response) {
        // response: { razorpay_payment_id, ... }
        const user = auth.currentUser;
        try {
          if (user) {
            // save order record to Firestore (so purchase is persistent)
            await addDoc(collection(db, "orders"), {
              userId: user.uid,
              projectId: id,
              paymentId: response.razorpay_payment_id,
              createdAt: serverTimestamp(),
            });
            setPurchased(true);
          } else {
            // if no logged-in user, only unlock in session
            setPurchasedSession(true);
            alert(
              "Payment successful (session). To keep permanent access, please log in next time before purchase."
            );
          }
        } catch (err) {
          console.error("Error saving order:", err);
          // still unlock session if DB write fails
          setPurchasedSession(true);
        }
      },
      prefill: {
        email: auth.currentUser?.email || "",
      },
      theme: {
        color: "#00ffff",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: 40, color: "#0ff" }}>
        Loading...
      </h2>
    );

  if (!project)
    return (
      <h2 style={{ textAlign: "center", marginTop: 40, color: "red" }}>
        Project not found
      </h2>
    );

  // determine if download should be shown:
  const canDownload = (project.docFile && (purchased || purchasedSession));

  return (
    <div style={{ padding: "22px 40px", color: "#0ff" }}>
      <h2 style={{ textShadow: "0 0 10px #0ff", marginBottom: 10 }}>
        {project.title}
      </h2>

      {/* IMAGE GALLERY */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <img
          src={project.mainImage}
          alt="Project"
          onClick={() => setFullscreen(true)}
          style={{
            width: "100%",
            maxWidth: 850,
            height: "auto",
            maxHeight: 420,
            borderRadius: 12,
            boxShadow: "0 0 15px #0ff",
            cursor: "pointer",
            marginBottom: 20,
          }}
        />

        {project.images?.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() =>
                  setProject((prev) => ({ ...prev, mainImage: img }))
                }
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                  border:
                    project.mainImage === img ? "2px solid #0ff" : "2px solid #333",
                  boxShadow:
                    project.mainImage === img
                      ? "0 0 12px #0ff"
                      : "0 0 4px rgba(0,0,0,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen preview */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={project.mainImage}
            alt="fullscreen"
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              borderRadius: 12,
              boxShadow: "0 0 30px #0ff",
            }}
          />
        </div>
      )}

      {/* Short description */}
      <p style={{ fontSize: 19, lineHeight: 1.55, marginBottom: 20 }}>
        {project.shortDesc}
      </p>

{/* ---- UNIVERSAL THEORY PARSER ---- */}
{project.theory && (
  <>
    {(project.docFile && (purchased || purchasedSession)) ? (
      <a
        href={project.docFile}
        download={`${project.title.replace(/\s+/g, "_")}_Code.docx`}
        style={{
          padding: "12px 20px",
          background: "#00ff99",
          borderRadius: 6,
          display: "inline-block",
          marginBottom: 20,
          textDecoration: "none",
          color: "#000",
          fontWeight: "bold"
        }}
      >
        📥 Download Code (.docx)
      </a>
    ) : (
      <p style={{ color: "#ff5050", marginBottom: 18 }}>
        🔒 Buy Now to Download Code
      </p>
    )}

    <h3 style={{
      marginTop: 10,
      marginBottom: 10,
      fontSize: "26px",
      color: "#00f6ff",
      textShadow: "0 0 10px #00f6ff"
    }}>
      Theory
    </h3>

    {/* === UNIVERSAL PARSER === */}
    <div style={{ fontSize: "19px", lineHeight: "1.7", color: "#d9ffff" }}>
      {project.theory
        .replace(/•/g, "\n•")         // ensure bullets get new lines
        .replace(/\r?\n+/g, "\n")     // clean extra line breaks
        .split("\n")                  // split into lines
        .filter(line => line.trim().length > 0)
        .map((line, i) => {
          let text = line.replace(/^•\s*/, "").trim();

          // Detect headings automatically
          const headings = [
            "Abstract",
            "Keywords",
            "Introduction",
            "Working Principle",
            "Working",
            "Features",
            "Applications",
            "Future Scope",
            "Conclusion"
          ];

          let heading = headings.find(h =>
            text.toLowerCase().startsWith(h.toLowerCase())
          );

          if (heading) {
            return (
              <div key={i} style={{ marginBottom: 20 }}>
                <h4 style={{
                  color: "#00f6ff",
                  fontSize: "22px",
                  marginBottom: 5,
                  textShadow: "0 0 6px #00f6ff"
                }}>
                  {heading}
                </h4>
                <p>{text.replace(new RegExp(heading, "i"), "").trim()}</p>
              </div>
            );
          }

          // Normal bullet
          return (
            <p key={i} style={{ marginBottom: 12 }}>
              • {text}
            </p>
          );
        })}
    </div>
  </>
)}

{/* ==== PROCEDURE SECTION ==== */}
{project.procedure && (
  <>
    <h3
      style={{
        marginTop: "25px",
        marginBottom: "10px",
        fontSize: "22px",
        color: "#00f6ff",
        textShadow: "0 0 8px #00f6ff"
      }}
    >
      Procedure
    </h3>

    <pre
      style={{
        background: "rgba(0, 20, 30, 0.6)",
        padding: "18px",
        borderRadius: "8px",
        fontSize: "17px",
        color: "#d9ffff",
        whiteSpace: "pre-wrap",
        lineHeight: "1.55",
        border: "1px solid #00f6ff"
      }}
    >
      {project.procedure}
    </pre>
  </>
)}


      {/* Price */}
      <h3 style={{ marginTop: 20 }}>
        Price: <span style={{ color: "#00ff99" }}>₹{project.price}</span>
      </h3>

      {/* Buy button (opens Razorpay) */}
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => {
            // if user not logged in, remind them and offer to go to login
            if (!auth.currentUser) {
              const go = window.confirm(
                "You need to be logged in to save a purchase. Continue as guest (session-only access) or login?"
              );
              if (!go) {
                navigate("/login");
                return;
              }
            }
            handleBuyNow();
          }}
          style={{
            padding: "12px 20px",
            background: "#0ff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            color: "#000",
            boxShadow: "0 0 10px #0ff",
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
