const { Router } = require('express');
const router = Router();
const path = require("path")

router.get('/privacy', async (req, res) => {
    res.render('pages/privacy')
})

module.exports = router