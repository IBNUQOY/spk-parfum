module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Kriteria', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nama: DataTypes.STRING,
    tipe: DataTypes.STRING,
    bobot: DataTypes.FLOAT,
  }, { tableName: 'kriteria', timestamps: false });
};
