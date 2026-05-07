const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Recommendation = sequelize.define('Recommendation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  recommended_user_id: { type: DataTypes.INTEGER },
  recommended_project_id: { type: DataTypes.INTEGER },
  match_score: { type: DataTypes.FLOAT, defaultValue: 0 },
  type: { type: DataTypes.ENUM('user_based', 'skill_based', 'project_based', 'popularity', 'replacement'), allowNull: false },
  is_seen: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'recommendations', timestamps: true, underscored: true });

return Recommendation;
};
