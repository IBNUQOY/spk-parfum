const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { sequelize, Alternatif, Kriteria, Nilai, Hasil } = require('./models');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const buildPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  app.use(express.static(buildPath));
}

app.get('/alternatif', async (req, res) => {
  const data = await Alternatif.findAll();
  res.json(data);
});

app.get('/alternatif/:id', async (req, res) => {
  const a = await Alternatif.findByPk(req.params.id);
  if (!a) return res.status(404).send();
  res.json(a);
});

app.post('/alternatif', async (req, res) => {
  const a = await Alternatif.create(req.body);
  res.status(201).json(a);
});

app.put('/alternatif/:id', async (req, res) => {
  const a = await Alternatif.findByPk(req.params.id);
  if (!a) return res.status(404).send();
  await a.update(req.body);
  res.json(a);
});

app.delete('/alternatif/:id', async (req, res) => {
  const a = await Alternatif.findByPk(req.params.id);
  if (!a) return res.status(404).send();
  await a.destroy();
  res.status(204).send();
});

// Kriteria
app.get('/kriteria', async (req, res) => {
  const data = await Kriteria.findAll();
  res.json(data);
});

app.post('/kriteria', async (req, res) => {
  const k = await Kriteria.create(req.body);
  res.status(201).json(k);
});

app.put('/kriteria/:id', async (req, res) => {
  const k = await Kriteria.findByPk(req.params.id);
  if (!k) return res.status(404).send();
  await k.update(req.body);
  res.json(k);
});

app.delete('/kriteria/:id', async (req, res) => {
  const k = await Kriteria.findByPk(req.params.id);
  if (!k) return res.status(404).send();
  await k.destroy();
  res.status(204).send();
});

// Nilai
app.get('/nilai', async (req, res) => {
  const data = await Nilai.findAll();
  res.json(data);
});

// Hasil
app.get('/hasil', async (req, res) => {
  const data = await Hasil.findAll();
  res.json(data);
});

app.post('/hasil', async (req, res) => {
  const h = await Hasil.create(req.body);
  res.status(201).json(h);
});

app.delete('/hasil/:id', async (req, res) => {
  const h = await Hasil.findByPk(req.params.id);
  if (!h) return res.status(404).send();
  await h.destroy();
  res.status(204).send();
});

if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
