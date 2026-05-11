const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getAdminSummary, getReports, moderateContent, deleteContent, createCause, updateCause, deleteCause } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/summary', getAdminSummary);
router.get('/reports', getReports);
router.post('/causes', createCause);
router.put('/causes/:id', updateCause);
router.delete('/causes/:id', deleteCause);
router.patch('/:type/:id/:action', moderateContent);
router.delete('/:type/:id', deleteContent);

module.exports = router;
