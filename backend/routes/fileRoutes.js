
const express = require('express');
const { listFiles, uploadFile, deleteFile } = require('../controllers/fileController');
const expressFileUpload = require('express-fileupload');


const router = express.Router();

// Route to list files from OpenAI API
router.get('/', listFiles);

router.post('/',expressFileUpload(),uploadFile)

router.delete('/:id', deleteFile);

module.exports = router;
