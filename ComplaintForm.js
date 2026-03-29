import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ComplaintForm.css";

function ComplaintForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    category: "pothole",
    address: "",
    manualAddress: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    isPublic: false,   // NEW
  });
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // show file name
    setForm((prev) => ({ ...prev, imageFile: file }));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/api/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // save URL so it is sent in handleSubmit
      setForm((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
      }));
    } catch (err) {
      console.error("Image upload error:", err.response?.data || err.message);
      setError("Could not upload image");
    }
  };

  const handleCaptureLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setForm((prev) => ({
            ...prev,
            address: `Lat: ${latitude}, Lng: ${longitude}`,
          }));
          setLocationCaptured(true);
        },
        () => {
          setError("Unable to fetch location. Allow permission.");
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // For now: use only imageUrl; ignore imageFile (no placeholder text)
    const image_url = form.imageUrl || "";

    try {
      await axios.post("http://localhost:5000/api/complaints/create", {
        user_id: user.id,
        category: form.category,
        description: form.description,
        location: form.address || form.manualAddress,
        image_url,
        is_public: form.isPublic ? 1 : 0, // NEW
      });
      navigate("/complaints");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not submit complaint"
      );
    }
  };

  return (
    <div className="complaint-bg">
      <div className="complaint-header">
        CivicSetu : Bridge between People and Solutions
      </div>
      <div className="complaint-form-card">
        <h2>Submit Complaint</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="garbage">Garbage</option>
            <option value="pothole">Pothole</option>
            <option value="streetlight">Street Light</option>
            <option value="water">Water Supply</option>
            <option value="sewage">Sewage</option>
            <option value="other">Other</option>
          </select>

          <div className="location-row">
            <button
              type="button"
              className="location-btn"
              onClick={handleCaptureLocation}
            >
              Capture Current Location
            </button>
            {locationCaptured && (
              <div className="location-captured">{form.address}</div>
            )}
          </div>

          <input
            name="manualAddress"
            type="text"
            value={form.manualAddress}
            onChange={handleChange}
            placeholder="Type address/manually add location"
            autoComplete="off"
          />

          <textarea
            name="description"
            placeholder="Describe the issue"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />

          <div className="image-upload-row">
            <label>Photo URL</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="Paste photo link"
              value={form.imageUrl}
              onChange={handleChange}
              autoComplete="off"
            />
            <span className="or-text">or</span>
            <label className="file-upload-label">
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <span className="upload-btn">Upload from device</span>
              {form.imageFile && (
                <span className="file-uploaded">
                  {form.imageFile.name}
                </span>
              )}
            </label>
          </div>

          {/* NEW: make public checkbox */}
          <div className="public-checkbox-row">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={form.isPublic}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
              />{" "}
              Make this complaint public so other citizens can support it
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
        <button
          className="back-btn"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ComplaintForm;
