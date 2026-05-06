const { Message, User, Connection, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { connection_id, content } = req.body;
    
    const connection = await Connection.findByPk(connection_id);
    if (!connection) return res.status(404).json({ message: "Communication channel not found" });
    if (connection.status !== 'accepted') return res.status(403).json({ message: "Channel not yet established" });
    
    // Auto-detect recipient
    const recipient_id = connection.requester_id === req.user.id ? connection.recipient_id : connection.requester_id;

    const message = await Message.create({
      connection_id,
      sender_id: req.user.id,
      recipient_id,
      content
    });

    res.json(message);
  } catch (err) {
    console.error('Send Message Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const messages = await Message.findAll({
      where: { connection_id: connectionId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    console.error('Get Chat History Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: { recipient_id: req.user.id, is_read: false }
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConnectionUnreadStats = async (req, res) => {
  try {
    const stats = await Message.findAll({
      where: { recipient_id: req.user.id, is_read: false },
      attributes: ['connection_id', [sequelize.fn('count', sequelize.col('id')), 'unread_count']],
      group: ['connection_id']
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { connectionId } = req.params;
    await Message.update(
      { is_read: true },
      { where: { connection_id: connectionId, recipient_id: req.user.id, is_read: false } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: err.message });
  }
};

