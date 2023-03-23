const { Router } = require('express');
const router = Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const playlistDb = db.table("playshare_list_db");
const rateLimiter = require('express-rate-limit');

const allowList = ["194.83.172.180"]
const newPlayShareLimiter = rateLimiter({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message:
        'Too many PlayShares created from this IP, please try again in 30 mins',
    standardHeaders: true,
    legacyHeaders: false,
})

router.get('/new/*', async (req, res) => {
    const { url, hostname, platform, playlistid } = await getUrlInfo(req)
    console.log(req.params)

    // res.json({ playlistUrl: url, hostname, platform, playlistid })
    // res.render('index', { url, hostname, platform, playlistid })
    res.redirect(`/ps/new?plstid=${playlistid}`)
    playlistDb.push(`${playlistid}`, { platform, origin_url: hostname })
    console.log(platform)
})

router.get('/ps/new', async (req, res) => {
    try {
        const playshareList = await playlistDb.get(`${req.query.plstid}`)
        if (!playshareList || playshareList[0].platform === undefined) {
            return res.render('creation-failed')
        }
        res.render('new-playlist', { plstid: req.query.plstid, platform: `${playshareList[0].platform}`, origin: `${playshareList[0].origin_url}` })
    } catch (e) {
        console.log(e)
    }
})

router.get('/ps/info/*', async (req, res) => {
    try {
        const shareList = await playlistDb.get(req.params[0])
        console.log(shareList)
        if (!shareList || shareList[0].platform === undefined) {
            return res.render('render-fail')
        }
        res.render('playshare-info', { origin: shareList[0].origin_url, plstid: req.params[0] })
    } catch (error) {
        console.log(error)
    }
})

router.get('/ps/dev-routes/creation-failed', async (req, res) => {
    res.render('creation-failed')
})

module.exports = router;

async function getUrlInfo(req) {
    let url = new URL(req.params[0])
    let hostname = url.hostname
    let platform = "none";
    let playlistid = Date.now();

    if (hostname === "open.spotify.com") {
        platform = "spotify"
    } else if (hostname === "music.youtube.com") {
        platform = "ytmusic"
    } else if (hostname === "youtube.com" || hostname === "youtu.be") {
        platform = "youtube"
    } else {
        platform = "unknown"
    }

    return { url, hostname, platform, playlistid }
}