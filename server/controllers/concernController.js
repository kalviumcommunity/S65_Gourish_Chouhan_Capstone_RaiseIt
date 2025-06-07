const Concern = require('../models/Concern');

const getConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find({}).populate('user', 'name email');
    res.status(200).json(concerns);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createConcern = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    if (!title || !description || !user) {
      return res.status(400).json({ message: 'Title, description, and user required' });
    }
    const concern = new Concern({ title, description, user });
    const saved = await concern.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const concern = await Concern.findById(id);
    if (!concern) {
      return res.status(404).json({ message: 'Concern not found' });
    }

    if (title) concern.title = title;
    if (description) concern.description = description;

    const updatedConcern = await concern.save();
    res.status(200).json(updatedConcern);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getConcerns, createConcern, updateConcern };