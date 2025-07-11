const express = require('express');
const router = express.Router();
const { generate } = require('../Controllers/Generate');
const { generatestory } = require('../Controllers/Generatestory');
const { generatevideo } = require('../Controllers/generatevideo');

// ✅ Use POST for sending topic, ageGroup, language in body
router.post('/generate', generate);
router.post('/generatestory', generatestory);
router.post('/generateImage', generatevideo); // ✅ Corrected

module.exports = router; // ✅ Ensure it's exported
