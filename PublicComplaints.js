// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/ComplaintsList.css"; // reuse styles

// function PublicComplaints() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchPublicComplaints() {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/complaints/public/all"
//         );
//         setComplaints(res.data);
//       } catch (err) {
//         console.error(
//           "fetchPublicComplaints error:",
//           err.response?.data || err.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPublicComplaints();
//   }, []);

//   const handleVote = async (id) => {
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/complaints/${id}/vote`,
//         { user_id: user.id }
//       );

//       // Update votes count locally
//       setComplaints((prev) =>
//         prev.map((c) =>
//           c.id === id ? { ...c, votes: res.data.votes } : c
//         )
//       );
//     } catch (err) {
//       console.error(
//         "vote error:",
//         err.response?.data || err.message
//       );
//       // Optional: show message if already voted
//       alert(err.response?.data?.message || "Could not vote");
//     }
//   };

//   if (loading) {
//     return <div className="complaints-bg">Loading public complaints...</div>;
//   }

//   return (
//     <div className="complaints-bg">
//       <div className="complaints-header">
//         CivicSetu : Bridge between People and Solutions
//       </div>

//       <div className="complaints-card">
//         <h2>Public Complaints</h2>

//         <div className="complaints-table-container">
//           <table className="complaints-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Citizen</th>
//                 <th>Category</th>
//                 <th>Description</th>
//                 <th>Location</th>
//                 <th>Votes</th>
//                 <th>Support</th>
//               </tr>
//             </thead>
//             <tbody>
//               {complaints.map((c) => (
//                 <tr key={c.id}>
//                   <td>{c.id}</td>
//                   <td>{c.user_name || "Unknown"}</td>
//                   <td>{c.category}</td>
//                   <td>{c.description}</td>
//                   <td>{c.location || "Not available"}</td>
//                   <td>{c.votes}</td>
//                   <td>
//                     <button
//                       className="action-btn"
//                       onClick={() => handleVote(c.id)}
//                     >
//                       +1 Support
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {complaints.length === 0 && (
//             <div className="no-complaints">No public complaints yet.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PublicComplaints;



import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ComplaintsList.css"; // reuse table styles

function PublicComplaints() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicComplaints() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/complaints/public/all"
        );
        setComplaints(res.data);
      } catch (err) {
        console.error(
          "fetchPublicComplaints error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPublicComplaints();
  }, []);

  const handleVote = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/complaints/${id}/vote`,
        { user_id: user.id }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, votes: res.data.votes } : c
        )
      );
    } catch (err) {
      console.error(
        "vote error:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Could not vote");
    }
  };

  if (loading) {
    return (
      <div className="complaints-bg">
        <div className="complaints-header">
          CivicSetu : Bridge between People and Solutions
        </div>
        <div className="complaints-card">
          Loading public complaints...
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-bg">
      <div className="complaints-header">
        CivicSetu : Bridge between People and Solutions
      </div>

      <div className="complaints-card">
        <h2>Public Complaints</h2>

        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Description</th>
                <th>Location</th>
                <th>Votes</th>
                <th>Support</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.user_name || "Unknown"}</td>
                  <td>{c.category}</td>
                  <td>{c.description}</td>
                  <td>{c.location || "Not available"}</td>
                  <td>{c.votes}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleVote(c.id)}
                    >
                      +1 Support
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {complaints.length === 0 && (
            <div className="no-complaints">No public complaints yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicComplaints;
