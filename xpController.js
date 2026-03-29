// backend/controllers/xpController.js
const db = require("../config/db");

// amount can be positive or negative, we make sure xp never goes below 0
async function addXpToCitizen(citizenId, amount) {
    console.log("ADD_XP called for citizen:", citizenId, "amount:", amount);

  if (!amount) return;

  const query = `
    UPDATE citizens
    SET xp = GREATEST(0, xp + ?)
    WHERE id = ?
  `;

  await db.query(query, [amount, citizenId]);
}


// Add XP to a staff member
async function addXpToStaff(staffId, xpToAdd) {
  try {
    await db.query(
      "UPDATE staff SET xp = xp + ? WHERE id = ?",
      [xpToAdd, staffId]
    );
  } catch (err) {
    console.error("addXpToStaff error:", err);
    throw err;
  }
}

// NEW: map xp to level + title
function getCitizenLevel(xp) {
  if (xp >= 300) return { level: 4, title: "City Guardian", nextLevelXp: null };
  if (xp >= 150) return { level: 3, title: "Neighborhood Hero", nextLevelXp: 300 };
  if (xp >= 50)  return { level: 2, title: "Active Citizen", nextLevelXp: 150 };
  return { level: 1, title: "New Citizen", nextLevelXp: 50 };
}

module.exports = { addXpToCitizen , addXpToStaff, getCitizenLevel };
