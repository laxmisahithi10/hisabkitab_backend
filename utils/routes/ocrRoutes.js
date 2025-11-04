const express = require('express');
const upload = require('../../middleware/uploadMiddleware');
const ocrController = require('../../controllers/ocrController');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/process', upload.single('image'), ocrController.uploadBill);

module.exports = router;    