const Concern = require('../models/Concern');
const Group = require('../models/Group');
const Discussion = require('../models/Discussion');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Cause = require('../models/Cause');
const { createCause, updateCause, deleteCause } = require('./causeController');

const modelMap = {
  concerns: Concern,
  groups: Group,
  discussions: Discussion,
};

const populateMap = {
  concerns: ['user', 'reports.user'],
  groups: ['creator', 'reports.user'],
  discussions: ['author', 'reports.user', 'group'],
};

async function getContent(type, id) {
  const Model = modelMap[type];
  if (!Model) return null;
  return Model.findById(id);
}

exports.getAdminSummary = async (req, res) => {
  try {
    const [users, concerns, groups, discussions, donations, causes, reportedConcerns, reportedGroups, reportedDiscussions] = await Promise.all([
      User.countDocuments(),
      Concern.countDocuments({ moderationStatus: { $ne: 'hidden' } }),
      Group.countDocuments({ moderationStatus: { $ne: 'hidden' } }),
      Discussion.countDocuments({ moderationStatus: { $ne: 'hidden' } }),
      Donation.countDocuments({ status: 'verified' }),
      Cause.countDocuments(),
      Concern.countDocuments({ moderationStatus: 'reported' }),
      Group.countDocuments({ moderationStatus: 'reported' }),
      Discussion.countDocuments({ moderationStatus: 'reported' }),
    ]);

    res.json({ users, concerns, groups, discussions, donations, causes, reportedConcerns, reportedGroups, reportedDiscussions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin summary' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [concerns, groups, discussions] = await Promise.all([
      Concern.find({ moderationStatus: 'reported' }).populate('user', 'name email').populate('reports.user', 'name email'),
      Group.find({ moderationStatus: 'reported' }).populate('creator', 'name email').populate('reports.user', 'name email'),
      Discussion.find({ moderationStatus: 'reported' }).populate('author', 'name email').populate('group', 'name').populate('reports.user', 'name email'),
    ]);

    res.json({ concerns, groups, discussions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load reports' });
  }
};

exports.moderateContent = async (req, res) => {
  try {
    const { type, id, action } = req.params;
    const content = await getContent(type, id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    if (action === 'hide') content.moderationStatus = 'hidden';
    else if (action === 'restore') {
      content.moderationStatus = 'active';
      content.reports = [];
    } else {
      return res.status(400).json({ message: 'Invalid moderation action' });
    }

    await content.save();

    const populated = await modelMap[type].findById(id).populate(populateMap[type]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to moderate content' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const content = await getContent(type, id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    await content.deleteOne();
    if (type === 'groups') await Discussion.deleteMany({ group: id });

    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete content' });
  }
};

exports.createCause = createCause;
exports.updateCause = updateCause;
exports.deleteCause = deleteCause;
