const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const Skill = sequelize.define('Skill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  category: { type: DataTypes.ENUM('technical', 'design', 'soft', 'management', 'other'), defaultValue: 'technical' },
  icon: { type: DataTypes.STRING(50) },
}, { tableName: 'skills', timestamps: true, underscored: true });

return Skill;
};
