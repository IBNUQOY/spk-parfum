import { Sequelize, DataTypes } from 'sequelize';

let cached = null;

export async function getDb() {
  if (cached) return cached;

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    pool: { max: 3, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: {
      connectTimeout: 10000,
    },
  });

  const Alternatif = sequelize.define('Alternatif', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    kelompok_harga: DataTypes.STRING,
    komisi: DataTypes.FLOAT,
    harga_detail: DataTypes.FLOAT,
    rating: DataTypes.FLOAT,
    klasifikasi: DataTypes.STRING,
  }, { tableName: 'alternatif', timestamps: false });

  const Kriteria = sequelize.define('Kriteria', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: DataTypes.STRING,
    tipe: DataTypes.STRING,
    bobot: DataTypes.FLOAT,
  }, { tableName: 'kriteria', timestamps: false });

  const Nilai = sequelize.define('Nilai', {
    id: { type: DataTypes.STRING, primaryKey: true },
    alternatifId: { type: DataTypes.INTEGER, allowNull: false },
    kriteriaId: { type: DataTypes.INTEGER, allowNull: false },
    nilai: DataTypes.FLOAT,
  }, { tableName: 'nilai', timestamps: false });

  const Hasil = sequelize.define('Hasil', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: DataTypes.STRING,
    skor: DataTypes.FLOAT,
    ranking: DataTypes.INTEGER,
  }, { tableName: 'hasil', timestamps: false });

  Nilai.belongsTo(Alternatif, { foreignKey: 'alternatifId' });
  Nilai.belongsTo(Kriteria, { foreignKey: 'kriteriaId' });

  await sequelize.authenticate();

  cached = { sequelize, Alternatif, Kriteria, Nilai, Hasil };
  return cached;
}
