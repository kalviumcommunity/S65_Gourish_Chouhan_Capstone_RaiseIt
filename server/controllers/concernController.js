const Concern = require('../models/Concern');
const mongoose = require('mongoose');

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === 'string') return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  return [];
};

const getConcerns = async (req, res) => {
  try {
    const { limit, sort, search, status, tag } = req.query;
    const maxLimit = Math.min(Number(limit) || 50, 100);
    const filter = { moderationStatus: { $ne: 'hidden' } };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') filter.status = status;
    if (tag) filter.tags = { $in: [tag] };

    const query = Concern.find(filter).populate('user', 'name email');

    if (sort === 'trending') {
      query.sort({ upvotes: -1, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    const concerns = await query.limit(maxLimit);
    res.status(200).json(concerns);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getConcernById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid concern id' });
    }

    const concern = await Concern.findOne({ _id: id, moderationStatus: { $ne: 'hidden' } })
      .populate('user', 'name email')
      .populate('comments.user', 'name email');

    if (!concern) return res.status(404).json({ message: 'Concern not found' });

    res.status(200).json(concern);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createConcern = async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const concern = new Concern({
      title: title.trim(),
      description: description.trim(),
      image: image || '',
      tags: normalizeTags(tags),
      user: req.user._id,
    });
    const saved = await concern.save();
    const populated = await saved.populate('user', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, tags, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid concern id' });
    }

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({ message: 'Concern not found' });
    }

    if (concern.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this concern' });
    }

    if (title) concern.title = title.trim();
    if (description) concern.description = description.trim();
    if (typeof image === 'string') concern.image = image;
    if (tags !== undefined) concern.tags = normalizeTags(tags);
    if (status) concern.status = status;

    const updatedConcern = await concern.save();
    const populated = await updatedConcern.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
    ]);
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteConcern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid concern id' });
    }

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({ message: 'Concern not found' });
    }

    if (concern.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this concern' });
    }

    await concern.deleteOne();
    res.status(200).json({ message: 'Concern deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid concern id' });
    }

    const concern = await Concern.findById(id);
    if (!concern) return res.status(404).json({ message: 'Concern not found' });

    const userId = req.user._id.toString();
    const existingIndex = concern.upvotes.findIndex((upvote) => upvote.toString() === userId);

    if (existingIndex >= 0) {
      concern.upvotes.splice(existingIndex, 1);
    } else {
      concern.upvotes.push(req.user._id);
    }

    const saved = await concern.save();
    const populated = await saved.populate('user', 'name email');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid concern id' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const concern = await Concern.findById(id);
    if (!concern) return res.status(404).json({ message: 'Concern not found' });

    concern.comments.push({ user: req.user._id, text: text.trim() });
    const saved = await concern.save();
    const populated = await saved.populate([
      { path: 'user', select: 'name email' },
      { path: 'comments.user', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const reportConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid concern id' });
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Report reason is required' });

    const concern = await Concern.findById(id);
    if (!concern) return res.status(404).json({ message: 'Concern not found' });

    concern.reports.push({ user: req.user._id, reason: reason.trim() });
    concern.moderationStatus = 'reported';
    await concern.save();
    res.status(201).json({ message: 'Concern reported' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to report concern' });
  }
};

module.exports = {
  getConcerns,
  getConcernById,
  createConcern,
  updateConcern,
  deleteConcern,
  toggleUpvote,
  addComment,
  reportConcern,
};
