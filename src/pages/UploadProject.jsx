import React, { useState } from "react";

export default function UploadProject() {
  const [imageURL, setImageURL] = useState("");
  const [fileURL, setFileURL] = useState("");

  // 🔵 IMAGE UPLOAD FUNCTION
  const uploadImage = async (event) => {
    const file = event.target.files[0];

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "electronics_preset"); // your preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmfwotsue/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    setImageURL(result.secure_url);
  };

  // 🔵 CODE FILE / PDF / ZIP UPLOAD FUNCTION
  const uploadFile = async (event) => {
    const file = event.target.files[0];

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "electronics_preset"); // same preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmfwotsue/raw/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    setFileURL(result.secure_url);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Project</h1>

      {/* IMAGE UPLOAD */}
      <h3>Upload Image</h3>
      <input type="file" onChange={uploadImage} />

      {imageURL && (
        <>
          <p>Uploaded Image Preview:</p>
          <img src={imageURL} alt="uploaded" width="200" />
          <p>Image URL:</p>
          <code>{imageURL}</code>
        </>
      )}

      <br />
      <br />

      {/* FILE UPLOAD */}
      <h3>Upload Code/PDF/ZIP File</h3>
      <input type="file" onChange={uploadFile} />

      {fileURL && (
        <>
          <p>Uploaded File Link:</p>
          <a href={fileURL} target="_blank" rel="noreferrer">
            {fileURL}
          </a>
        </>
      )}
    </div>
  );
}
