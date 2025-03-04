
const express = require('express');
const { listFiles, uploadFile } = require('../controllers/fileController');

const router = express.Router();

// Route to list files from OpenAI API
router.get('/', listFiles);

router.post('/',uploadFile)

module.exports = router;
