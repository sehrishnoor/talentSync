const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  bio: { type: DataTypes.TEXT },
  avatar_url: { type: DataTypes.STRING(255) },
  state: { type: DataTypes.STRING(100) },
  avg_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_ratings: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  github_url: { type: DataTypes.STRING(255) },
  linkedin_url: { type: DataTypes.STRING(255) },
  portfolio_url: { type: DataTypes.STRING(255) },
}, { tableName: 'users',  timestamps: true, underscored: true });


return User;
};
