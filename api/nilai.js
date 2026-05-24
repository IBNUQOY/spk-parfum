import { getDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { Nilai } = await getDb();

  if (req.method === 'GET') {
    const data = await Nilai.findAll();
    return res.json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
