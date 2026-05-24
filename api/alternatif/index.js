import { getDb } from '../db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { Alternatif } = await getDb();

  if (req.method === 'GET') {
    const data = await Alternatif.findAll();
    return res.json(data);
  }

  if (req.method === 'POST') {
    const a = await Alternatif.create(req.body);
    return res.status(201).json(a);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
