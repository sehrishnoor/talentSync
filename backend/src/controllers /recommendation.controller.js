const { User, Skill, UserSkill, Project, ProjectSkill, TeamMember, Connection, sequelize } = require('../models');
const { Op } = require('sequelize');

// Suggest users based on current user's skill set overlap
exports.getRecommendedUsers = async (req, res) => {
  try {
    const mySkills = await UserSkill.findAll({ where: { user_id: req.user.id }, attributes: ['skill_id'] });
    const mySkillIds = mySkills.map(s => s.skill_id);

    const candidates = await User.findAll({
      where: { id: { [Op.ne]: req.user.id }, is_available: true },
      include: [{ model: Skill, as: 'skills', through: { attributes: ['proficiency'] } }],
      attributes: ['id', 'name', 'avg_rating', 'state', 'avatar_url', 'bio'],
    });

    const myConnections = await Connection.findAll({
      where: { [Op.or]: [{ requester_id: req.user.id }, { recipient_id: req.user.id }] }
    });

    const scored = candidates.map(u => {
      const theirIds = u.skills.map(s => s.id);
      const overlap = mySkillIds.filter(id => theirIds.includes(id)).length;
      const complement = theirIds.filter(id => !mySkillIds.includes(id)).length;
      const score = (overlap * 0.4 + complement * 0.3 + u.avg_rating * 5 * 0.3).toFixed(2);
      
      const conn = myConnections.find(c => c.requester_id === u.id || c.recipient_id === u.id);
      
      return { 
        user: { ...u.toJSON(), connectionStatus: conn ? conn.status : null }, 
        score: parseFloat(score) 
      };
    }).sort((a, b) => b.score - a.score).slice(0, 12);

    return res.json(scored);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Suggest projects matching user's skills
exports.getRecommendedProjects = async (req, res) => {
  try {
    const mySkills = await UserSkill.findAll({ where: { user_id: req.user.id }, attributes: ['skill_id'] });
    const mySkillIds = mySkills.map(s => s.skill_id);

    const joined = await TeamMember.findAll({ where: { user_id: req.user.id }, attributes: ['project_id'] });
    const joinedIds = joined.map(j => j.project_id);

    const projects = await Project.findAll({
      where: { status: 'open', id: { [Op.notIn]: joinedIds.length ? joinedIds : [0] } },
      include: [
        { model: Skill, as: 'required_skills', through: { attributes: [] } },
        { model: User, as: 'leader', attributes: ['id', 'name', 'avatar_url', 'avg_rating'] },
      ],
    });

    const scored = projects.map(p => {
      const rqIds = p.required_skills.map(s => s.id);
      const matched = rqIds.filter(id => mySkillIds.includes(id)).length;
      const match_pct = rqIds.length > 0 ? ((matched / rqIds.length) * 100).toFixed(1) : 0;
      return { project: p, match_pct: parseFloat(match_pct) };
    }).sort((a, b) => b.match_pct - a.match_pct).slice(0, 9);

    return res.json(scored);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Top-rated available users
exports.getPopularUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_available: true, total_ratings: { [Op.gte]: 1 } },
      include: [{ model: Skill, as: 'skills', through: { attributes: ['proficiency'] } }],
      attributes: ['id', 'name', 'avg_rating', 'total_ratings', 'state', 'avatar_url', 'bio'],
      order: [['avg_rating', 'DESC'], ['total_ratings', 'DESC']],
      limit: 12,
    });

    const myConnections = await Connection.findAll({
      where: { [Op.or]: [{ requester_id: req.user.id }, { recipient_id: req.user.id }] }
    });

    const enriched = users.map(u => {
      const conn = myConnections.find(c => c.requester_id === u.id || c.recipient_id === u.id);
      return { ...u.toJSON(), connectionStatus: conn ? conn.status : null };
    });

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Skill match for a specific project
exports.getProjectMatches = async (req, res) => {
  try {
    const { projectId } = req.params;
    const ps = await ProjectSkill.findAll({ where: { project_id: projectId }, attributes: ['skill_id'] });
    const skillIds = ps.map(p => p.skill_id);

    const currentMembers = await TeamMember.findAll({ where: { project_id: projectId, status: 'active' }, attributes: ['user_id'] });
    const memberIds = currentMembers.map(m => m.user_id);

    const candidates = await User.findAll({
      where: { is_available: true, id: { [Op.notIn]: memberIds.length ? memberIds : [0] } },
      include: [{ model: Skill, as: 'skills', through: { attributes: ['proficiency'] } }],
      attributes: ['id', 'name', 'avg_rating', 'state', 'avatar_url', 'bio'],
    });

    const scored = candidates.map(u => {
      const uSkillIds = u.skills.map(s => s.id);
      const matched = skillIds.filter(id => uSkillIds.includes(id)).length;
      const match_score = skillIds.length > 0 ? ((matched / skillIds.length) * 100).toFixed(1) : 0;
      return { user: { id: u.id, name: u.name, avg_rating: u.avg_rating, state: u.state, avatar_url: u.avatar_url, bio: u.bio, skills: u.skills }, match_score: parseFloat(match_score) };
    }).sort((a, b) => b.match_score - a.match_score || b.user.avg_rating - a.user.avg_rating).slice(0, 10);

    return res.json(scored);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
