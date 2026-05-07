const { Connection, User, Skill } = require('../models');
const { Op } = require('sequelize');

exports.requestConnection = async (req, res) => {
  try {
    const { recipient_id } = req.body;
    if (recipient_id === req.user.id) return res.status(400).json({ message: "Unable to connect with own identity" });

    const existing = await Connection.findOne({
      where: {
        [Op.or]: [
          { requester_id: req.user.id, recipient_id },
          { requester_id: recipient_id, recipient_id: req.user.id }
        ]
      }
    });

    if (existing) return res.status(400).json({ message: "Connection sequence already initialized" });

    const connection = await Connection.create({ requester_id: req.user.id, recipient_id });
    res.json(connection);
  } catch (err) {
    console.error('Connection Request Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ requester_id: req.user.id }, { recipient_id: req.user.id }],
        status: 'accepted'
      },
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'state', 'avg_rating'], include: [{model: Skill, as: 'skills'}] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'state', 'avg_rating'], include: [{model: Skill, as: 'skills'}] }
      ]
    });
    res.json(connections);
  } catch (err) {
    console.error('Get Connections Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.findAll({
      where: { recipient_id: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'requester', attributes: ['id', 'name', 'state', 'avg_rating'] }]
    });
    res.json(requests);
  } catch (err) {
    console.error('Get Pending Requests Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected'
    const connection = await Connection.findByPk(req.params.id);

    if (!connection) return res.status(404).json({ message: "Connection not found" });
    if (connection.recipient_id !== req.user.id) return res.status(403).json({ message: "Unauthorized interface access" });

    connection.status = status;
    await connection.save();
    res.json(connection);
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ message: err.message });
  }
};
