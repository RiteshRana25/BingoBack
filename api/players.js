import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // Load JSON data
  let playersData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

  if (req.method === 'GET') {
    return res.status(200).json({ playersData });
  }

  if (req.method === 'POST') {
    const { key, values } = req.body;

    if (!key || !Array.isArray(values)) {
      return res.status(400).json({ error: 'Key and values array are required' });
    }

    if (playersData[key]) {
      // Merge unique values
      playersData[key] = Array.from(new Set([...playersData[key], ...values]));
    } else {
      playersData[key] = values;
    }

    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(playersData, null, 2));

    return res.status(200).json({ message: 'Player updated', playersData });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
