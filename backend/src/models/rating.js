const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rater_id: { type: DataTypes.INTEGER, allowNull: false },
  ratee_id: { type: DataTypes.INTEGER, allowNull: false },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  review: { type: DataTypes.TEXT },
}, { tableName: 'ratings', timestamps: true, underscored: true });

return Rating;
};
