import React, { useState, useEffect } from "react"; // NEW: useEffect added
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";
import profilePic from "../assets/user-avatar.png"; // Use a user icon image, add this to src/assets

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Dashboard user:", user);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Citizen XP state
  const [xpInfo, setXpInfo] = useState(null);
  const [xpError, setXpError] = useState("");
  const [showXp, setShowXp] = useState(false);

  // Staff XP state
  const [staffXpInfo, setStaffXpInfo] = useState(null);
  const [staffXpError, setStaffXpError] = useState("");
  const [showStaffXp, setShowStaffXp] = useState(false);

  //  Leaderboard state (citizens)
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbError, setLbError] = useState("");
  const [lbLoading, setLbLoading] = useState(false);

  // NEW: Leaderboard state (staff)
  const [staffLeaderboard, setStaffLeaderboard] = useState([]);
  const [staffLbError, setStaffLbError] = useState("");
  const [staffLbLoading, setStaffLbLoading] = useState(false);

  // Find staff rank from staffLeaderboard
  const myStaffRank = staffLeaderboard.find(
    (row) => row.id === user?.id
  )?.rank;

  // Profile icon click toggles menu
  const toggleMenu = () => setShowMenu(!showMenu);

  // Citizen: View XP handler
  const handleViewXp = async () => {
    try {
      setXpError("");
      const res = await axios.get(
        `http://localhost:5000/api/users/me?id=${user.id}`
      );
      console.log("XP response in frontend:", res.data);
      setXpInfo(res.data);
      setShowXp(true);
    } catch (err) {
      setXpError(err.response?.data?.message || "Could not load XP");
    }
  };


  // Staff: View XP handler
  const handleViewStaffXp = async () => {
    try {
      console.log("Staff XP clicked");
      setStaffXpError("");
      const token = localStorage.getItem("token"); // adjust if you store differently

      const res = await axios.get(
        "http://localhost:5000/api/staff/xp/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Staff XP response:", res.data);
      setStaffXpInfo(res.data);
      setShowStaffXp(true);
      setShowXp(false); // hide citizen card
    } catch (err) {
      console.error(err);
      setStaffXpError(
        err.response?.data?.message || "Could not load staff XP"
      );
    }
  };

  // Load leaderboard (citizens)
  const loadLeaderboard = async () => {
    try {
      setLbError("");
      setLbLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/leaderboard/citizens?limit=5"
      );
      setLeaderboard(res.data);
    } catch (err) {
      setLbError(err.response?.data?.message || "Could not load leaderboard");
    } finally {
      setLbLoading(false);
    }
  };

  // Load staff leaderboard
  const loadStaffLeaderboard = async () => {
    try {
      setStaffLbError("");
      setStaffLbLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/leaderboard/staff?limit=5"
      );
      setStaffLeaderboard(res.data);
    } catch (err) {
      setStaffLbError(
        err.response?.data?.message || "Could not load staff leaderboard"
      );
    } finally {
      setStaffLbLoading(false);
    }
  };

  // Load leaderboard when citizen dashboard opens
  useEffect(() => {
    if (user?.role === "citizen") {
      loadLeaderboard();
    }
    if (user?.role === "staff") {
      loadStaffLeaderboard();   // <—— ADD THIS LINE
    }
  }, [user?.role]);

  return (
    <div className="dashboard-bg">
      {/* Header Bar */}
      <div className="dashboard-header">
        CivicSetu : Bridge between People and Solutions
      </div>

      {/* Top Navigation Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-left">
          <span className="welcome-text">
            Welcome, <span className="user-name">{user?.name}</span>
          </span>
        </div>

        <div className="dashboard-actions">
          {/* Citizen buttons */}
          {user?.role === "citizen" && (
            <>
              <button
                className="topbar-btn"
                onClick={() => navigate("/complaint/new")}
              >
                Submit Complaint
              </button>
              <button
                className="topbar-btn"
                onClick={() => navigate("/complaints")}
              >
                View Complaints
              </button>

              {/* NEW: View Public Complaints */}
              <button
                className="topbar-btn"
                onClick={() => navigate("/complaints/public")}
              >
                View Public Complaints
              </button>

              {/*  View XP button for citizens */}
              <button className="topbar-btn xp-topbar-btn" onClick={handleViewXp}>
                View My XP
              </button>
            </>
          )}

          {/* Staff buttons */}
          {user?.role === "staff" && (
            <>
              <button
                className="topbar-btn"
                onClick={() => navigate("/complaints")}
              >
                View Complaints
              </button>
              <button
                className="topbar-btn xp-topbar-btn"
                onClick={handleViewStaffXp}
              >
                View My XP
              </button>
            </>
          )}

          <div className="profile-dropdown">
            <img
              src={profilePic}
              className="profile-icon"
              alt="profile"
              onClick={toggleMenu}
            />
            {showMenu && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/edit-profile");
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Section w/ Description */}
      <div className="dashboard-content">
        {/* Citizen XP card  */}
        {user?.role === "citizen" && showXp && xpInfo && (
          <div className="xp-card">
            <div className="xp-card-header">
              <span className="xp-badge">XP</span>
              <div>
                <h3>{xpInfo.title}</h3>
                <p className="xp-level">Level {xpInfo.level}</p>
              </div>
            </div>

            <p className="xp-line">
              <span>XP Progress</span>
              {xpInfo.nextLevelXp ? (
                <span>
                  {xpInfo.xp} / {xpInfo.nextLevelXp}
                </span>
              ) : (
                <span>{xpInfo.xp}</span>
              )}
            </p>

            {xpInfo.nextLevelXp && (
              <>
                <div className="xp-bar">
                  <div
                    className="xp-bar-fill"
                    style={{
                      width:
                        ((xpInfo.xp / xpInfo.nextLevelXp) * 100).toFixed(0) + "%",
                    }}
                  />
                </div>
                <p className="xp-to-next">
                  {xpInfo.nextLevelXp - xpInfo.xp > 0
                    ? `${xpInfo.nextLevelXp - xpInfo.xp} XP to reach next level`
                    : "You’re ready for the next rank!"}
                </p>
              </>
            )}

            {/* Badges */}
            {Array.isArray(xpInfo.badges) && xpInfo.badges.length > 0 && (
              <div className="xp-badges">
                <p className="xp-badges-title">Badges earned</p>
                <div className="xp-badges-list">
                  {xpInfo.badges.map((badge, index) => (
                    <div key={badge.id || index} className="xp-badge-chip">
                      <span className="xp-badge-chip-name">{badge.name}</span>
                      <span className="xp-badge-chip-desc">
                        {badge.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Citizens inside XP card */}
            {!lbLoading && !lbError && leaderboard.length > 0 && (
              <div className="xp-leaderboard">
                <h4 className="xp-leaderboard-title">Top Citizens</h4>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Citizen</th>
                      <th>XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row) => {
                      const isMe = row.id === user?.id;
                      return (
                        <tr
                          key={row.id}
                          className={isMe ? "leaderboard-row-me" : ""}
                        >
                          <td>{row.rank}</td>
                          <td>
                            {row.name}
                            {isMe ? " (You)" : ""}
                          </td>
                          <td>{row.xp}</td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            )}

            {lbLoading && (
              <p className="leaderboard-info">Loading top citizens...</p>
            )}

            {lbError && <p className="leaderboard-error">{lbError}</p>}

            {xpError && <div className="xp-error">{xpError}</div>}
          </div>
        )}

        {/* Staff XP card + Top Staff */}
        {user?.role === "staff" && showStaffXp && staffXpInfo && (
          <div className="xp-card">
            <div className="xp-card-header">
              <span className="xp-badge">XP</span>
              <div>
                <h3>{staffXpInfo.title}</h3>
                <p className="xp-level">Level {staffXpInfo.level}</p>

                {myStaffRank && (
                  <span className="xp-rank-badge">
                    Rank #{myStaffRank} among staff
                  </span>
                )}
              </div>
            </div>

            <p className="xp-line">
              <span>Total XP</span>
              <span>{staffXpInfo.xp}</span>
            </p>

            {/* Top Staff leaderboard */}
            {!staffLbLoading &&
              !staffLbError &&
              staffLeaderboard.length > 0 && (
                <div className="xp-leaderboard">
                  <h4 className="xp-leaderboard-title">Top Staff</h4>
                  <table className="leaderboard-table staff-leaderboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Staff</th>
                        <th>XP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffLeaderboard.map((row) => {
                        const isMe = row.id === user?.id;
                        return (
                          <tr
                            key={row.id}
                            className={isMe ? "leaderboard-row-me" : ""}
                          >
                            <td>{row.rank}</td>
                            <td>
                              {row.name}
                              {isMe ? " (You)" : ""}
                            </td>
                            <td>{row.xp}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            {staffLbLoading && (
              <p className="leaderboard-info">Loading top staff...</p>
            )}

            {staffLbError && (
              <p className="leaderboard-error">{staffLbError}</p>
            )}

            {staffXpError && (
              <div className="xp-error">{staffXpError}</div>
            )}
          </div>
        )}


        <div className="about-section">
          <h2>What is CivicSetu?</h2>
          <p>
            CivicSetu is your easy bridge to connect with your municipality. Register complaints, track their status, and see how local problems get solved. We empower citizens and staff to work together for a better, cleaner, and smarter city.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
