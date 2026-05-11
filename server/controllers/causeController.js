const Cause = require('../models/Cause');

function sanitizeCauseInput(body) {
  return {
    name: body.name?.trim(),
    mission: body.mission?.trim(),
    category: body.category?.trim(),
    logo: body.logo?.trim() || '',
    image: body.image?.trim() || '',
    featuredProject: body.featuredProject?.trim() || '',
    impact: body.impact?.trim() || '',
    urgency: body.urgency || 'medium',
    active: body.active !== false,
  };
}

exports.getCauses = async (req, res) => {
  try {
    const includeInactive = req.user?.role === 'admin' && req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { active: true };
    const causes = await Cause.find(filter).sort({ createdAt: -1 });
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load causes' });
  }
};

exports.createCause = async (req, res) => {
  try {
    const data = sanitizeCauseInput(req.body);
    if (!data.name || !data.mission || !data.category) {
      return res.status(400).json({ message: 'Name, mission, and category are required' });
    }

    const cause = await Cause.create(data);
    res.status(201).json(cause);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create cause' });
  }
};

exports.updateCause = async (req, res) => {
  try {
    const data = sanitizeCauseInput(req.body);
    if (!data.name || !data.mission || !data.category) {
      return res.status(400).json({ message: 'Name, mission, and category are required' });
    }

    const cause = await Cause.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cause' });
  }
};

exports.deleteCause = async (req, res) => {
  try {
    const cause = await Cause.findByIdAndDelete(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    res.json({ message: 'Cause deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete cause' });
  }
};
