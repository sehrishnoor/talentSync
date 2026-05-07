const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const DropoutHistory = sequelize.define('DropoutHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  team_member_id: { type: DataTypes.INTEGER, allowNull: false },
  reason: { type: DataTypes.TEXT },
  dropped_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'dropout_history', timestamps: true, underscored: true });


return DropoutHistory;
};
