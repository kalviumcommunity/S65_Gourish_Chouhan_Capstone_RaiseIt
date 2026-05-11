const mongoose = require('mongoose');
const Group = require('../models/Group');
const Discussion = require('../models/Discussion');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateGroup = (query) =>
  query.populate('creator', 'name email').populate('members', 'name email').populate('admins', 'name email');

exports.getGroups = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { moderationStatus: { $ne: 'hidden' } };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const groups = await populateGroup(Group.find(filter).sort({ createdAt: -1 }).limit(100));
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, image, rules } = req.body;
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }

    const group = await Group.create({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      image: image || '',
      rules: Array.isArray(rules) ? rules.filter(Boolean) : [],
      creator: req.user._id,
      admins: [req.user._id],
      members: [req.user._id],
    });

    const populated = await populateGroup(Group.findById(group._id));
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const group = await populateGroup(Group.findOne({ _id: req.params.id, moderationStatus: { $ne: 'hidden' } }));
    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.admins.some((admin) => admin.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Only group admins can update this group' });
    }

    const { name, description, category, image, rules } = req.body;
    if (name) group.name = name.trim();
    if (description) group.description = description.trim();
    if (category) group.category = category.trim();
    if (typeof image === 'string') group.image = image;
    if (Array.isArray(rules)) group.rules = rules.filter(Boolean);

    await group.save();
    const populated = await populateGroup(Group.findById(group._id));
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update group' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the group creator can delete this group' });
    }

    await Discussion.deleteMany({ group: group._id });
    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete group' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.some((member) => member.toString() === req.user._id.toString())) {
      group.members.push(req.user._id);
      await group.save();
    }

    const populated = await populateGroup(Group.findById(group._id));
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to join group' });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Group creator cannot leave their own group' });
    }

    group.members = group.members.filter((member) => member.toString() !== req.user._id.toString());
    group.admins = group.admins.filter((admin) => admin.toString() !== req.user._id.toString());
    await group.save();

    const populated = await populateGroup(Group.findById(group._id));
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave group' });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const discussions = await Discussion.find({ group: req.params.id, moderationStatus: { $ne: 'hidden' } })
      .populate('author', 'name email')
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discussions' });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid group id' });

    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.some((member) => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Join this group before starting a discussion' });
    }

    const discussion = await Discussion.create({
      group: group._id,
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
    });

    const populated = await Discussion.findById(discussion._id).populate('author', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create discussion' });
  }
};

exports.getDiscussionById = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    if (!isValidId(id) || !isValidId(discussionId)) return res.status(400).json({ message: 'Invalid id' });

    const discussion = await Discussion.findOneAndUpdate(
      { _id: discussionId, group: id, moderationStatus: { $ne: 'hidden' } },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name email')
      .populate('replies.author', 'name email');

    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discussion' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    const { content } = req.body;
    if (!isValidId(id) || !isValidId(discussionId)) return res.status(400).json({ message: 'Invalid id' });
    if (!content || !content.trim()) return res.status(400).json({ message: 'Reply content is required' });

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.some((member) => member.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Join this group before replying' });
    }

    const discussion = await Discussion.findOne({ _id: discussionId, group: id, moderationStatus: { $ne: 'hidden' } });
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    discussion.replies.push({ author: req.user._id, content: content.trim() });
    await discussion.save();

    const populated = await Discussion.findById(discussion._id)
      .populate('author', 'name email')
      .populate('replies.author', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply' });
  }
};

exports.reportGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid group id' });
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Report reason is required' });

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.reports.push({ user: req.user._id, reason: reason.trim() });
    group.moderationStatus = 'reported';
    await group.save();
    res.status(201).json({ message: 'Group reported' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report group' });
  }
};

exports.reportDiscussion = async (req, res) => {
  try {
    const { id, discussionId } = req.params;
    const { reason } = req.body;
    if (!isValidId(id) || !isValidId(discussionId)) return res.status(400).json({ message: 'Invalid id' });
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Report reason is required' });

    const discussion = await Discussion.findOne({ _id: discussionId, group: id });
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });

    discussion.reports.push({ user: req.user._id, reason: reason.trim() });
    discussion.moderationStatus = 'reported';
    await discussion.save();
    res.status(201).json({ message: 'Discussion reported' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report discussion' });
  }
};
