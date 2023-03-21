const { Router } = require('express');
const router = Router();
const path = require("path")

router.get('/style.css', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'style.css'))
})

module.exports = router