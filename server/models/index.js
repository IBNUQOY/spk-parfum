const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || 'spk_parfum', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});

const Alternatif = require('./alternatif')(sequelize, DataTypes);
const Kriteria = require('./kriteria')(sequelize, DataTypes);
const Nilai = require('./nilai')(sequelize, DataTypes);
const Hasil = require('./hasil')(sequelize, DataTypes);

Nilai.belongsTo(Alternatif, { foreignKey: 'alternatifId' });
Nilai.belongsTo(Kriteria, { foreignKey: 'kriteriaId' });

module.exports = { sequelize, Alternatif, Kriteria, Nilai, Hasil };
