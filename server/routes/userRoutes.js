const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getMe, getUserById, updateMe, getUserConcerns, getUserGroups, getUserDonations } = require('../controllers/userController');

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/:id', getUserById);
router.get('/:id/concerns', getUserConcerns);
router.get('/:id/groups', getUserGroups);
router.get('/:id/donations', getUserDonations);

module.exports = router;
