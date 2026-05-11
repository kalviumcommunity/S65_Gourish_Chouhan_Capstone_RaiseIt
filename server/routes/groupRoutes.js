const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getDiscussions,
  createDiscussion,
  getDiscussionById,
  addReply,
  reportGroup,
  reportDiscussion,
} = require('../controllers/groupController');

const router = express.Router();

router.route('/').get(getGroups).post(protect, createGroup);
router.route('/:id').get(getGroupById).put(protect, updateGroup).delete(protect, deleteGroup);
router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);
router.post('/:id/report', protect, reportGroup);
router.route('/:id/discussions').get(getDiscussions).post(protect, createDiscussion);
router.route('/:id/discussions/:discussionId').get(getDiscussionById);
router.post('/:id/discussions/:discussionId/replies', protect, addReply);
router.post('/:id/discussions/:discussionId/report', protect, reportDiscussion);

module.exports = router;
