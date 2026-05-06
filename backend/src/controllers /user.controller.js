const { User, Skill, UserSkill, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      // attributes: { exclude: ['password_hash'] },
      attributes: ['id', 'name', 'avatar_url', 'avg_rating', 'state', 'bio'],
      include: [{ model: Skill, as: 'skills', through: { attributes: ['proficiency', 'years_experience'] } }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { state, skill, available, page = 1, limit = 12 } = req.query;
    const where = {};
    if (state) where.state = state;
    if (available !== undefined) where.is_available = available === 'true';

    const include = [{ model: Skill, as: 'skills', through: { attributes: ['proficiency'] } }];
    if (skill) {
      include[0].where = { name: { [Op.like]: `%${skill}%` } };
      include[0].required = true;
    }

    const { rows: users, count } = await User.findAndCountAll({
      where,
      include,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      distinct: true,
    });

    return res.json({ users, total: count, page: parseInt(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, state, github_url, linkedin_url, portfolio_url, is_available } = req.body;
    await User.update({ name, bio, state, github_url, linkedin_url, portfolio_url, is_available }, { where: { id: req.user.id } });
    const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skill_id, proficiency, years_experience } = req.body;
    const existing = await UserSkill.findOne({ where: { user_id: req.user.id, skill_id } });
    if (existing) {
      await existing.update({ proficiency, years_experience });
      return res.json({ message: 'Skill updated', skill: existing });
    }
    const us = await UserSkill.create({ user_id: req.user.id, skill_id, proficiency, years_experience });
    return res.status(201).json(us);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    await UserSkill.destroy({ where: { user_id: req.user.id, skill_id: req.params.skillId } });
    return res.json({ message: 'Skill removed' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMySkills = async (req, res) => {
  try {
    const skills = await UserSkill.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Skill }],
    });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
