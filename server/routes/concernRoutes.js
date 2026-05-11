const express = require('express');
const router = express.Router();
const {
  getConcerns,
  getConcernById,
  createConcern,
  updateConcern,
  deleteConcern,
  toggleUpvote,
  addComment,
  reportConcern,
} = require('../controllers/concernController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(getConcerns).post(protect, createConcern);
router.route('/:id').get(getConcernById).put(protect, updateConcern).delete(protect, deleteConcern);
router.route('/:id/upvote').post(protect, toggleUpvote);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/report').post(protect, reportConcern);

module.exports = router;
