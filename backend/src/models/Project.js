const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  leader_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'), defaultValue: 'open' },
  state: { type: DataTypes.STRING(100) },
  max_members: { type: DataTypes.INTEGER, defaultValue: 5 },
  deadline: { type: DataTypes.DATE },
  tags: { type: DataTypes.TEXT },
  github_url: { type: DataTypes.STRING(255) },
}, { tableName: 'projects', timestamps: true, underscored: true });

return Project;
};
