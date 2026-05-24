import { getDb } from '../db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const { Alternatif } = await getDb();

  if (req.method === 'GET') {
    const a = await Alternatif.findByPk(id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    return res.json(a);
  }

  if (req.method === 'PUT') {
    const a = await Alternatif.findByPk(id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    await a.update(req.body);
    return res.json(a);
  }

  if (req.method === 'DELETE') {
    const a = await Alternatif.findByPk(id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    await a.destroy();
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
