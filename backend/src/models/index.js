const sequelize = require('../config/database');

// 1. Initialize models by passing the sequelize instance
const User = require('./User')(sequelize);
const Skill = require('./Skill')(sequelize);
const UserSkill = require('./UserSkill')(sequelize);
const Project = require('./Project')(sequelize);
const ProjectSkill = require('./ProjectSkill')(sequelize);
const TeamMember = require('./TeamMember')(sequelize);
const Rating = require('./Rating')(sequelize);
const DropoutHistory = require('./DropoutHistory')(sequelize);
const Recommendation = require('./Recommendation')(sequelize);
const Connection = require('./Connection')(sequelize);
const Message = require('./Message')(sequelize);

// 2. Define Associations AFTER all models are initialized
// User ↔ Skills
User.belongsToMany(Skill, { through: UserSkill, foreignKey: 'user_id', otherKey: 'skill_id', as: 'skills' });
Skill.belongsToMany(User, { through: UserSkill, foreignKey: 'skill_id', otherKey: 'user_id', as: 'users' });

// Project ↔ Leader
Project.belongsTo(User, { foreignKey: 'leader_id', as: 'leader' });
User.hasMany(Project, { foreignKey: 'leader_id', as: 'led_projects' });

// Connections
User.hasMany(Connection, { foreignKey: 'requester_id', as: 'sent_requests' });
User.hasMany(Connection, { foreignKey: 'recipient_id', as: 'received_requests' });
Connection.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
Connection.belongsTo(User, { foreignKey: 'recipient_id', as: 'recipient' });

// Messages
Connection.hasMany(Message, { foreignKey: 'connection_id', as: 'messages' });
Message.belongsTo(Connection, { foreignKey: 'connection_id' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Standard Many-to-Many Association
Project.belongsToMany(Skill, { 
  through: ProjectSkill, 
  foreignKey: 'project_id', 
  otherKey: 'skill_id', 
  as: 'required_skills' // This MUST match the 'as' in your controller
});

Skill.belongsToMany(Project, { 
  through: ProjectSkill, 
  foreignKey: 'skill_id', 
  otherKey: 'project_id', 
  as: 'projects' 
});

Project.hasMany(TeamMember, { foreignKey: 'project_id', as: 'team_members' });
TeamMember.belongsTo(Project, { foreignKey: 'project_id' });

// --- TeamMember ↔ User (For the nested include) ---
// Controller uses as: 'member' inside team_members
TeamMember.belongsTo(User, { foreignKey: 'user_id', as: 'member' });
User.hasMany(TeamMember, { foreignKey: 'user_id' });

// 3. Export
module.exports = {
  sequelize,
  User, Skill, UserSkill,
  Project, ProjectSkill,
  TeamMember, Rating,
  DropoutHistory, Recommendation, 
  Connection, Message,
};
