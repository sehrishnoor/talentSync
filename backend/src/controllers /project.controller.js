const { Project, User, Skill, TeamMember, ProjectSkill } = require('../models');
const { Op } = require('sequelize');

exports.getAllProjects = async (req, res) => {
  try {
    const { status, state, skill, page = 1, limit = 9 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (state) where.state = state;

    const include = [
      { model: User, as: 'leader', attributes: ['id', 'name', 'avatar_url', 'avg_rating'] },
      { model: Skill, as: 'required_skills', through: { attributes: ['importance'] } },
    { 
  model: TeamMember, 
  as: 'team_members', 
  required: false,
  include: [{ model: User, as: 'member', attributes: ['id', 'name', 'avatar_url'] }]
}
    ];
    if (skill) {
      include[1].where = { name: { [Op.like]: `%${skill}%` } };
      include[1].required = true;
    }

    const { rows: projects, count } = await Project.findAndCountAll({
      where, include,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true,
      order: [['created_at', 'DESC']],
    });

    return res.json({ projects, total: count, page: parseInt(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'avatar_url', 'avg_rating', 'state'] },
        { model: Skill, as: 'required_skills', through: { attributes: ['importance'] } },
        {
          model: TeamMember, as: 'team_members',
          include: [{ model: User, as: 'member', attributes: ['id', 'name', 'avatar_url', 'avg_rating', 'state'] }],
        },
      ],
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, state, max_members, deadline, tags, github_url, skill_ids } = req.body;
    
    // 1. Create the project
    const project = await Project.create({
      title, description, state, max_members, deadline, tags, github_url,
      leader_id: req.user?.id,
    });

    // 2. Handle Skill Associations
    if (skill_ids && skill_ids.length > 0) {
      const ps = skill_ids.map((sid) => ({ 
        project_id: project.id, 
        skill_id: sid, 
        importance: 'required' 
      }));
      await ProjectSkill.bulkCreate(ps);
    }

    // 3. Auto-add leader as active member
    await TeamMember.create({ 
      project_id: project.id, 
      user_id: req.user.id, 
      role: 'Leader', 
      status: 'active', 
      joined_at: new Date() 
    });

    // 4. CRITICAL: Fetch the fresh data with the EXACT same aliases as getProjectById
    const full = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'leader', attributes: ['id', 'name', 'avatar_url'] },
        { model: Skill, as: 'required_skills' }, // Ensure this 'as' matches index.js
      ],
    });

    return res.status(201).json(full);
  } catch (err) {
    console.error("Creation Error:", err); // Add this to see exactly what failed
    return res.status(500).json({ message: err.message });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.leader_id !== req.user?.id && req.user?.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, state, max_members, status, deadline, tags, github_url, skill_ids } = req.body;
    await project.update({ title, description, state, max_members, status, deadline, tags, github_url });

    if (skill_ids) {
      await ProjectSkill.destroy({ where: { project_id: project.id } });
      if (skill_ids.length > 0) {
        const ps = skill_ids.map((sid) => ({ project_id: project.id, skill_id: sid, importance: 'required' }));
        await ProjectSkill.bulkCreate(ps);
      }
    }
    return res.json({ message: 'Project updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.leader_id !== req.user?.id && req.user?.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await project.destroy();
    return res.json({ message: 'Project deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const existing = await TeamMember.findOne({ where: { project_id: project.id, user_id: req.user?.id } });
    if (existing) return res.status(400).json({ message: 'Already applied or member' });

    const tm = await TeamMember.create({ project_id: project.id, user_id: req.user?.id, role: req.body?.role || 'Member', status: 'pending' });
    return res.status(201).json(tm);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.body;
    const tm = await TeamMember.findByPk(memberId, { include: [{ model: Project }] });
    if (!tm) return res.status(404).json({ message: 'Member record not found' });

    const project = await Project.findByPk(tm.project_id);
    if (project.leader_id !== req.user?.id && req.user?.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    if (status === 'active') tm.joined_at = new Date();
    await tm.update({ status });
    return res.json({ message: 'Member status updated', tm });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const led = await Project.findAll({
      where: { leader_id: req.user?.id },
      include: [{ model: Skill, as: 'required_skills' }],
      order: [['created_at', 'DESC']],
    });
    const joined = await TeamMember.findAll({
      where: { user_id: req.user?.id, status: 'active' },
      include: [{ model: Project, include: [{ model: User, as: 'leader', attributes: ['id', 'name'] }, { model: Skill, as: 'required_skills' }] }],
    });
    return res.json({ led, joined: joined.map(j => j.Project) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

