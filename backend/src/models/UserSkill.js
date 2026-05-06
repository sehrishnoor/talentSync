const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const UserSkill = sequelize.define('UserSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  skill_id: { type: DataTypes.INTEGER, allowNull: false },
  proficiency: { type: DataTypes.INTEGER, defaultValue: 1, validate: { min: 1, max: 5 } },
  years_experience: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { tableName: 'user_skills', timestamps: true, underscored: true });

return UserSkill;
};
