import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // Load JSON data
  let playersData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  if (req.method === 'GET') {
    // Return all players
    res.status(200).json({ playersData });
  } else if (req.method === 'POST') {
    const { key, values } = req.body;

    if (!key || !values) {
      return res.status(400).json({ error: 'Key and values are required' });
    }

    if (playersData[key]) {
      playersData[key] = [...new Set([...playersData[key], ...values])];
    } else {
      playersData[key] = values;
    }

    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(playersData, null, 2));

    res.status(200).json({ message: 'Player updated', playersData });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
