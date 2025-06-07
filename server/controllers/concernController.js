const Concern = require('../models/Concern');

const getConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find({});
    res.status(200).json(concerns);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createConcern = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description required' });
    }
    const concern = new Concern({ title, description });
    const saved = await concern.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getConcerns, createConcern };