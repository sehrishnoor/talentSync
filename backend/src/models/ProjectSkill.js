const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const ProjectSkill = sequelize.define('ProjectSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  skill_id: { type: DataTypes.INTEGER, allowNull: false },
  importance: { type: DataTypes.ENUM('required', 'preferred'), defaultValue: 'required' },
}, { tableName: 'project_skills', timestamps: true, underscored: true });

return ProjectSkill;
};
