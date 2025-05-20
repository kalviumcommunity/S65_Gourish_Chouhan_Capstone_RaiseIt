const mongoose = require('mongoose');

const concernSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Concern = mongoose.model('Concern', concernSchema);

module.exports = Concern;
