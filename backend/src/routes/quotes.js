const express = require('express');
const router = express.Router();

// dev placeholder route
router.post('/', (req, res) => {
    res.status(200).json({ message: 'placeholder: route test' });
});

module.exports = router;