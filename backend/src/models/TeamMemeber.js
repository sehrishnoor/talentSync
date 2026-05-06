const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const TeamMember = sequelize.define('TeamMember', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING(100), defaultValue: 'Member' },
  status: { type: DataTypes.ENUM('pending', 'active', 'dropped', 'removed'), defaultValue: 'pending' },
  joined_at: { type: DataTypes.DATE },
}, { tableName: 'team_members', timestamps: true, underscored: true });

return TeamMember;
};
