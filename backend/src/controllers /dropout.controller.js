const { DropoutHistory, TeamMember, Project, User, Skill, UserSkill, ProjectSkill, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.logDropout = async (req, res) => {
  try {
    const { project_id, user_id, reason } = req.body;

    const tm = await TeamMember.findOne({ where: { project_id, user_id, status: 'active' } });
    if (!tm) return res.status(404).json({ message: 'Active team member not found' });

    const project = await Project.findByPk(project_id);
    if (project.leader_id !== req.user?.id && req.user?.id !== parseInt(user_id) && req.user?.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await tm.update({ status: 'dropped' });

    const dropout = await DropoutHistory.create({ project_id, user_id, team_member_id: tm.id, reason, dropped_at: new Date() });

    // Find replacement suggestions
    const requiredSkills = await ProjectSkill.findAll({ where: { project_id }, attributes: ['skill_id'] });
    const skillIds = requiredSkills.map(ps => ps.skill_id);

    const currentMembers = await TeamMember.findAll({ where: { project_id, status: 'active' }, attributes: ['user_id'] });
    const memberIds = currentMembers.map(m => m.user_id);

    const candidates = await User.findAll({
      where: { id: { [Op.notIn]: [...memberIds, parseInt(user_id)] }, is_available: true },
      include: [{ model: Skill, as: 'skills', through: { attributes: ['proficiency'] } }],
      attributes: ['id', 'name', 'avg_rating', 'state', 'avatar_url'],
    });

    const scored = candidates.map(u => {
      const userSkillIds = u.skills.map(s => s.id);
      const matched = skillIds.filter(sid => userSkillIds.includes(sid)).length;
      const match_score = skillIds.length > 0 ? ((matched / skillIds.length) * 100).toFixed(1) : 0;
      return { user: u, match_score: parseFloat(match_score) };
    }).sort((a, b) => b.match_score - a.match_score || b.user.avg_rating - a.user.avg_rating).slice(0, 5);

    return res.status(201).json({ dropout, replacements: scored });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getProjectDropouts = async (req, res) => {
  try {
    const dropouts = await DropoutHistory.findAll({
      where: { project_id: req.params.projectId },
      include: [{ model: User, as: 'dropped_user', attributes: ['id', 'name', 'avatar_url'] }],
      order: [['dropped_at', 'DESC']],
    });
    return res.json(dropouts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getDropoutStats = async (req, res) => {
  try {
    const total = await DropoutHistory.count();
    const byProject = await DropoutHistory.findAll({
      attributes: ['project_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['project_id'],
      include: [{ model: Project, attributes: ['title'] }],
      order: [[sequelize.fn('COUNT', sequelize.col('DropoutHistory.id')), 'DESC']],
      limit: 10,
    });
    return res.json({ total, byProject });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
