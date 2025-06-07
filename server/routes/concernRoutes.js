const express = require('express');
const router = express.Router();
const { getConcerns, createConcern } = require('../controllers/concernController');

router.route('/').get(getConcerns).post(createConcern);

module.exports = router;