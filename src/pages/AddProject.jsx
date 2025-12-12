// src/pages/AddProject.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// 🔴 IMPORTANT:
// Replace these with your real Cloudinary values
const CLOUD_NAME = "dmfwotsue";          // e.g. "dxabc123"
const UPLOAD_PRESET = "electronics_preset";   // e.g. "electronicshub_preset";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [theory, setTheory] = useState("");
  const [procedure, setProcedure] = useState("");
  const [components, setComponents] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]); // { id, url, name, uploading, error }
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
const [docFile, setDocFile] = useState("");



  const navigate = useNavigate();

  // handle files from input or drag-drop
  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    files.forEach((file) => uploadSingleFile(file));
  };

  // upload a single image to Cloudinary
  const uploadSingleFile = async (file) => {
    const tempId = `${file.name}-${Date.now()}-${Math.random()}`;

    // add placeholder image entry (uploading)
    setImages((prev) => [
      ...prev,
      { id: tempId, url: "", name: file.name, uploading: true, error: "" },
    ]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId
              ? { ...img, url: data.secure_url, uploading: false }
              : img
          )
        );
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setImages((prev) =>
        prev.map((img) =>
          img.id === tempId
            ? {
                ...img,
                uploading: false,
                error: err.message || "Upload error",
              }
            : img
        )
      );
    }
  };

  // drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // basic validation
    if (!title.trim()) {
      return setFormError("Please enter project title.");
    }
    if (!price || isNaN(Number(price))) {
      return setFormError("Please enter a valid price.");
    }
    if (images.length === 0) {
      return setFormError("Please upload at least one project image.");
    }
    if (images.some((img) => img.uploading)) {
      return setFormError("Please wait — some images are still uploading.");
    }

    const imageUrls = images
      .filter((img) => img.url && !img.error)
      .map((img) => img.url);

    if (imageUrls.length === 0) {
      return setFormError("All uploads failed. Please try again.");
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "projects"), {
        title: title.trim(),
        shortDesc: shortDesc.trim(),
        price: Number(price),
        images: imageUrls,
        createdAt: serverTimestamp(),
      });

      // reset form
      setTitle("");
      setShortDesc("");
      setPrice("");
      setImages([]);

      // go back to admin projects list (change if your route is different)
      navigate("/admin/all-projects");
    } catch (err) {
      console.error("Error saving project:", err);
      setFormError("Failed to save project. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "#0ff",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "1.6rem",
          marginBottom: "15px",
          textShadow: "0 0 12px #0ff",
        }}
      >
        Add New Project
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        {/* Error box */}
        {formError && (
          <div
            style={{
              background: "rgba(255,0,0,0.1)",
              border: "1px solid red",
              borderRadius: 8,
              padding: 10,
              marginBottom: 15,
              color: "red",
              fontSize: 13,
            }}
          >
            {formError}
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5 }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #0ff",
              background: "rgba(0,0,0,0.7)",
              color: "#0ff",
            }}
            placeholder="e.g. Line Follower Robot using IR Sensor"
          />
        </div>

        {/* Short Description */}
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5 }}>
            Short Description
          </label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #0ff",
              background: "rgba(0,0,0,0.7)",
              color: "#0ff",
              resize: "vertical",
            }}
            placeholder="Brief explanation of the project..."
          />
        </div>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 5 }}>
            Price (in ₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "200px",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #0ff",
              background: "rgba(0,0,0,0.7)",
              color: "#0ff",
            }}
            placeholder="e.g. 99"
          />
        </div>

        {/* Drag & Drop Upload Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px solid #00ffaa" : "2px dashed #0ff",
            borderRadius: 12,
            padding: "20px",
            marginBottom: "20px",
            textAlign: "center",
            background: "rgba(0,10,20,0.7)",
            boxShadow: dragActive
              ? "0 0 20px #00ffaa"
              : "0 0 15px rgba(0,255,255,0.3)",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("project-images-input")?.click()}
        >
          <p style={{ marginBottom: 10 }}>
            <strong>Drag & drop images here</strong> or click to browse
          </p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            You can upload multiple images (JPG, PNG, etc.)
          </p>

          <input
            id="project-images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Images Gallery Preview */}
        {images.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 10 }}>Images Gallery</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: "relative",
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid #0ff",
                    background: "rgba(0,0,0,0.8)",
                  }}
                >
                  {img.url ? (
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        padding: 8,
                      }}
                    >
                      {img.uploading
                        ? "Uploading..."
                        : img.error || "Error uploading"}
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(255,0,0,0.8)",
                      border: "none",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      fontSize: 14,
                      lineHeight: "24px",
                      textAlign: "center",
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>

                  {/* Small status label */}
                  {img.uploading && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        fontSize: 10,
                        textAlign: "center",
                        background: "rgba(0,0,0,0.7)",
                        padding: "2px 4px",
                      }}
                    >
                      Uploading…
                    </div>
                  )}
                  {img.error && !img.uploading && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        fontSize: 10,
                        textAlign: "center",
                        background: "rgba(120,0,0,0.9)",
                        padding: "2px 4px",
                      }}
                    >
                      Error
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 20px",
            background: "#0ff",
            color: "#000",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 15px #0ff",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Saving..." : "Save Project"}
        </button>
      </form>
    </div>
  );
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
  } else {
    alert("DOCX upload failed!");
  }
};


};

export default AddProject;
