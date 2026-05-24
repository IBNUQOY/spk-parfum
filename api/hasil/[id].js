import { getDb } from '../db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const { Hasil } = await getDb();

  if (req.method === 'DELETE') {
    const h = await Hasil.findByPk(id);
    if (!h) return res.status(404).json({ error: 'Not found' });
    await h.destroy();
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
