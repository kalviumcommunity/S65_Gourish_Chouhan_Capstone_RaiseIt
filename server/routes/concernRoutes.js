const express = require('express');
const router = express.Router();
const {
  getConcerns,
  createConcern,
  updateConcern,
} = require('../controllers/concernController');

router.route('/').get(getConcerns).post(createConcern);
router.route('/:id').put(updateConcern).delete(deleteConcern);

module.exports = router;