const { Skill } = require('../models');
const { Op } = require('sequelize');

exports.getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const skills = await Skill.findAll({ where, order: [['name', 'ASC']] });
    return res.json(skills);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const { name, category, icon } = req.body;
    const existing = await Skill.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Skill already exists' });
    const skill = await Skill.create({ name, category, icon });
    return res.status(201).json(skill);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await Skill.destroy({ where: { id: req.params.id } });
    return res.json({ message: 'Skill deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
