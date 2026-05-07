const { User, Skill, UserSkill, Project, TeamMember, Rating, DropoutHistory, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalSkills, totalDropouts] = await Promise.all([
      User.count(),
      Project.count(),
      Skill.count(),
      DropoutHistory.count(),
    ]);

    const projectsByStatus = await Project.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
    });

    const topSkills = await UserSkill.findAll({
      attributes: ['skill_id', [sequelize.fn('COUNT', sequelize.col('user_id')), 'user_count']],
      group: ['skill_id'],
      include: [{ model: Skill, attributes: ['name', 'category'] }],
      order: [[sequelize.fn('COUNT', sequelize.col('user_id')), 'DESC']],
      limit: 10,
    });

    const topUsers = await User.findAll({
      where: { total_ratings: { [Op.gte]: 1 } },
      attributes: ['id', 'name', 'avg_rating', 'total_ratings', 'state', 'avatar_url'],
      order: [['avg_rating', 'DESC']],
      limit: 5,
    });

    const stateCollab = await User.findAll({
      attributes: ['state', [sequelize.fn('COUNT', sequelize.col('id')), 'user_count']],
      group: ['state'],
      where: { state: { [Op.ne]: null } },
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
    });

    const recentProjects = await Project.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      include: [{ model: User, as: 'leader', attributes: ['id', 'name'] }],
    });

    return res.json({ totalUsers, totalProjects, totalSkills, totalDropouts, projectsByStatus, topSkills, topUsers, stateCollab, recentProjects });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
