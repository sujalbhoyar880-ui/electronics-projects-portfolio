// src/pages/EditProject.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const CLOUD_NAME = "dmfwotsue";
const UPLOAD_PRESET = "electronics_preset";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [theory, setTheory] = useState("");
  const [procedure, setProcedure] = useState("");
  const [components, setComponents] = useState("");
  const [docFile, setDocFile] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, "projects", id));
        if (!snap.exists()) return setError("❌ Project not found!");

        const p = snap.data();

        setTitle(p.title || "");
        setShortDesc(p.shortDesc || "");
        setPrice(p.price || "");
        setImages(p.images || []);
        setTheory(p.theory || "");
        setProcedure(p.procedure || "");
        setComponents(p.components || "");
        setDocFile(p.docFile || "");

      } catch (err) {
        setError("Error loading project!");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);


  const handleUploadImages = async (files) => {
    const uploaded = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) uploaded.push(data.secure_url);
    }
    setImages((prev) => [...prev, ...uploaded]);
  };


  const handleUploadDoc = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (data.secure_url) {
      setDocFile(data.secure_url);
      alert("📄 Code file uploaded!");
    } else {
      alert("❌ Failed to upload file!");
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, "projects", id), {
        title,
        shortDesc,
        price: Number(price),
        images,
        theory,
        procedure,
        components,
        docFile,
        updatedAt: serverTimestamp(),
      });

      alert("✅ Project Updated!");
      navigate("/admin/all-projects");
    } catch (err) {
      alert("❌ Failed to update!");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <h2 style={{ color: "#0ff" }}>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;


  return (
    <div style={{ padding: 25, color: "#0ff" }}>
      <h2>Edit Project</h2>

      <form onSubmit={handleUpdate} style={{ maxWidth: 600 }}>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputBox}/>

        <label>Description</label>
        <textarea rows={3} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} style={inputBox}/>

        <label>Theory</label>
        <textarea rows={5} value={theory} onChange={(e) => setTheory(e.target.value)} style={inputBox}/>

        <label>Procedure</label>
        <textarea rows={5} value={procedure} onChange={(e) => setProcedure(e.target.value)} style={inputBox}/>

        <label>Components</label>
        <textarea rows={4} value={components} onChange={(e) => setComponents(e.target.value)} style={inputBox}/>

        <label>Price (₹)</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
          style={{ ...inputBox, width: "200px" }} />


        {/* IMAGES */}
        <h3>Project Images</h3>

        <input type="file" accept="image/*" multiple
          onChange={(e) => handleUploadImages(e.target.files)}
          style={{ marginBottom: 20 }} />

        {images.map((img, i) => (
          <div key={i} style={{ position: "relative", display: "inline-block", marginRight: 10 }}>
            <img src={img} alt="" style={{ width: 120, height: 100, borderRadius: 6, objectFit: "cover" }} />
            <button type="button"
              onClick={() => setImages(images.filter(x => x !== img))}
              style={removeBtn}>
              ✖
            </button>
          </div>
        ))}


        {/* DOCX FILE */}
        <h3>Project Code (.doc/.docx)</h3>
        <input
          type="file"
          accept=".doc,.docx"
          onChange={(e) => handleUploadDoc(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />

        {docFile && (
          <a href={docFile} target="_blank" style={{ color: "#0ff", marginBottom: 20, display: "block" }}>
            📥 View Uploaded Code File
          </a>
        )}


        {/* SAVE BUTTON */}
        <button type="submit" disabled={saving} style={saveButton}>
          {saving ? "Saving..." : "Update Project"}
        </button>

      </form>
    </div>
  );
};

const inputBox = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  border: "1px solid #0ff",
  background: "#000",
  color: "#0ff",
  borderRadius: 6
};

const saveButton = {
  background: "#0ff",
  color: "#000",
  padding: "12px 22px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: 10,
  boxShadow: "0 0 10px #0ff",
};

const removeBtn = {
  position: "absolute",
  top: 5,
  right: 5,
  background: "red",
  color: "#fff",
  width: 22,
  height: 22,
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
};

export default EditProject;
