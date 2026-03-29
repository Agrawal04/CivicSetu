import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ComplaintsList.css";

function ComplaintsList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchComplaints() {
      if (user.role === "citizen") {
        const res = await axios.get(
          `http://localhost:5000/api/complaints/user/${user.id}`
        );
        setComplaints(res.data);
      } else if (user.role === "staff") {
        const res = await axios.get(
          "http://localhost:5000/api/complaints/all"
        );
        setComplaints(res.data);
      }
    }
    fetchComplaints();
  }, [user]);

  // Staff: mark as solved
  const markSolved = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log("markSolved token:", token);

      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: "solved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "solved" } : c))
      );
    } catch (err) {
      console.error(
        "markSolved error:",
        err.response?.data || err.message
      );
    }
  };

  // Staff: mark as fake
  const markFake = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log("markFake token:", token);

      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: "fake" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "fake" } : c))
      );
    } catch (err) {
      console.error(
        "markFake error:",
        err.response?.data || err.message
      );
    }
  };

  // Citizen: delete own complaint
  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        data: { user_id: user.id },
      });

      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(
        "deleteComplaint error:",
        err.response?.data || err.message
      );
    }
  };

  // Citizen: make complaint public
  const makePublic = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}/public`,
        { user_id: user.id }
      );

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_public: 1 } : c))
      );
    } catch (err) {
      console.error(
        "makePublic error:",
        err.response?.data || err.message
      );
    }
  };

  const isValidImageURL = (url) => {
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const filteredComplaints =
    selectedCategory === "All"
      ? complaints
      : complaints.filter((c) => c.category === selectedCategory);

  return (
    <div className="complaints-bg">
      <div className="complaints-header">
        CivicSetu : Bridge between People and Solutions
      </div>

      <div className="complaints-card">
        <h2>{user.role === "citizen" ? "My Complaints" : "All Complaints"}</h2>

        {user.role === "staff" && (
          <div className="complaints-filters">
            <button
              className={
                selectedCategory === "All" ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>

            <button
              className={
                selectedCategory === "garbage"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("garbage")}
            >
              Garbage
            </button>

            <button
              className={
                selectedCategory === "pothole"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("pothole")}
            >
              Pothole
            </button>

            <button
              className={
                selectedCategory === "street light"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("street light")}
            >
              Street Light
            </button>

            <button
              className={
                selectedCategory === "water supply"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("water supply")}
            >
              Water Supply
            </button>

            <button
              className={
                selectedCategory === "sewage"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("sewage")}
            >
              Sewage
            </button>

            <button
              className={
                selectedCategory === "other"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => setSelectedCategory("other")}
            >
              Other
            </button>
          </div>
        )}

        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Description</th>
                <th>Location</th>
                <th>Photo</th>
                <th>Votes</th>
                <th>Status</th>
                {user.role === "staff" && <th>Action</th>}
                {user.role === "citizen" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    {user.role === "staff" ? c.user_name || "Unknown" : "You"}
                  </td>
                  <td>{c.category}</td>
                  <td>{c.description}</td>
                  <td>
                    {c.location ? (
                      <span>{c.location}</span>
                    ) : (
                      <span className="unknown">Not available</span>
                    )}
                  </td>
                  <td>
                    {isValidImageURL(c.image_url) ? (
                      <a
                        href={c.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="complaint-img-preview"
                          src={c.image_url}
                          alt="Uploaded"
                        />
                      </a>
                    ) : c.image_url ? (
                      <span className="file-uploaded-label">
                        {c.image_url}
                      </span>
                    ) : (
                      <span className="unknown">Not available</span>
                    )}
                  </td>

                  <td>{c.votes ?? 0}</td>

                  {/* status with fake label */}
                  <td>
                    {c.status === "fake" ? (
                      <span className="status-fake">fake complaint</span>
                    ) : c.status === "solved" ? (
                      <span className="status-solved">solved</span>
                    ) : (
                      <span className="status-pending">pending</span>
                    )}
                  </td>

                  {/* Staff actions */}
                  {user.role === "staff" && (
                    <td>
                      <div className="action-btn-group">
                        {c.status !== "fake" && (
                          <button
                            className="action-btn-fake"
                            onClick={() => markFake(c.id)}
                          >
                            Mark Fake
                          </button>
                        )}

                        {c.status !== "solved" && (
                          <button
                            className="action-btn"
                            onClick={() => markSolved(c.id)}
                          >
                            Mark Solved
                          </button>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Citizen actions */}
                  {user.role === "citizen" && (
                    <td>
                      <div className="action-btn-group">
                        {c.is_public === 0 && (
                          <button
                            className="action-btn"
                            style={{ marginRight: "8px" }}
                            onClick={() => makePublic(c.id)}
                          >
                            Make Public
                          </button>
                        )}
                        <button
                          className="action-btn"
                          onClick={() => deleteComplaint(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredComplaints.length === 0 && (
            <div className="no-complaints">No complaints found.</div>
          )}
        </div>
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ComplaintsList;
