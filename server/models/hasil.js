module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Hasil', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nama: DataTypes.STRING,
    skor: DataTypes.FLOAT,
    ranking: DataTypes.INTEGER,
  }, { tableName: 'hasil', timestamps: false });
};
