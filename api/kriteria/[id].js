import { getDb } from '../db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const { Kriteria } = await getDb();

  if (req.method === 'PUT') {
    const k = await Kriteria.findByPk(id);
    if (!k) return res.status(404).json({ error: 'Not found' });
    await k.update(req.body);
    return res.json(k);
  }

  if (req.method === 'DELETE') {
    const k = await Kriteria.findByPk(id);
    if (!k) return res.status(404).json({ error: 'Not found' });
    await k.destroy();
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
