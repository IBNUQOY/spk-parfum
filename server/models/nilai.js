module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Nilai', {
    id: { type: DataTypes.STRING, primaryKey: true },
    alternatifId: { type: DataTypes.INTEGER, allowNull: false },
    kriteriaId: { type: DataTypes.INTEGER, allowNull: false },
    nilai: DataTypes.FLOAT,
  }, { tableName: 'nilai', timestamps: false });
};
