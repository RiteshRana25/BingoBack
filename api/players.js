// api/players.js (for Vercel)
import fs from 'fs';
import path from 'path';

// Path to your data.json
const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // ====== CORS HEADERS ======
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ====== LOAD DATA ======
  let playersData = {};
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    playersData = JSON.parse(rawData);
  } catch (err) {
    console.error("Error reading data.json:", err);
    playersData = {};
  }

  // ====== GET REQUEST ======
  if (req.method === 'GET') {
    return res.status(200).json({ playersData });
  }

  // ====== POST REQUEST ======
  if (req.method === 'POST') {
    const { key, values } = req.body;

    if (!key || !values) {
      return res.status(400).json({ error: 'Key and values are required' });
    }

    // Merge new values with existing ones, avoid duplicates
    if (playersData[key]) {
      playersData[key] = [...new Set([...playersData[key], ...values])];
    } else {
      playersData[key] = values;
    }

    // Write updated data back to data.json
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(playersData, null, 2));
    } catch (err) {
      console.error("Error writing data.json:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }

    return res.status(200).json({ message: 'Player updated', playersData });
  }

  // ====== METHOD NOT ALLOWED ======
  return res.status(405).json({ error: 'Method not allowed' });
}
