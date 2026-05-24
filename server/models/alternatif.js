module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Alternatif', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nama: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    kelompok_harga: DataTypes.STRING,
    komisi: DataTypes.FLOAT,
    harga_detail: DataTypes.FLOAT,
    rating: DataTypes.FLOAT,
    klasifikasi: DataTypes.STRING,
  }, { tableName: 'alternatif', timestamps: false });
};
