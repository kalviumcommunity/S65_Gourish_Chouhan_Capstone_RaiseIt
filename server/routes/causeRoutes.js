const express = require('express');
const { getCauses } = require('../controllers/causeController');
const { optionalAuth } = require('../middlewares/optionalAuthMiddleware');

const router = express.Router();

router.get('/', optionalAuth, getCauses);

module.exports = router;
