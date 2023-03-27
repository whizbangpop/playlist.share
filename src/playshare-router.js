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

router.get('/new/*', async function newPlayShare(req, res) {
    try {
        const { url, hostname, platform, playlistid } = await getUrlInfo(req)
        res.redirect(`/ps/new?plstid=${playlistid}`)
        playlistDb.push(`${playlistid}`, { platform, origin_url: hostname })
    } catch (error) {
        throw new Error(error)
    }
})

router.get('/ps/new', async function newPlayShareRender(req, res) {
    try {
        const playshareList = await playlistDb.get(`${req.query.plstid}`)
        if (!playshareList || playshareList[0].platform === undefined) {
            const box_1_title = "Something Went Wrong!"
            const box_1_body = "<p>Something seemed to go wrong when creating your PlayShare. Please try again.</p>"
            const box_2_title = ""
            const box_2_body = `<p>If this error persists, contact WhizBangPop in the <a href="https://dsc.gg/sdstudios">SDStudios Discord server</a>.</p>`

            return res.render('pages/dynamicTemplate', { pageTitle: "Creation Failed", box_1_title, box_1_body, box_2_title,  box_2_body })
        }

        const box_1_title = "New PlayShare Created!"
        const box_1_body = `PlayShare ID: ${req.query.plstid} | Origin URL: ${playshareList[0].origin}`
        const box_2_title = "Share this PlayShare with Friends!"
        const box_2_body = `<a href="https://playshare.com/ps/${req.query.plstid}">https://playshare.com/share/${req.query.plstid}</a> <br> or <br> <a href="https://plyshre.io/${req.query.plstid}">https://plyshre.io/${req.query.plstid}</a>`

        res.render('pages/dynamicTemplate', { box_1_title, box_1_body, box_2_title, box_2_body, pageTitle: "New PlayShare" })
    } catch (e) {
        throw new Error(e)
    }
})

router.get('/ps/info/*', async function PlayShareInfo(req, res) {
    try {
        const shareList = await playlistDb.get(req.params[0])
        console.log(shareList)
        if (!shareList || shareList[0].platform === undefined) {
            return res.render('render-fail')
        }
        res.render('playshare-info', { origin: shareList[0].origin_url, plstid: req.params[0] })
    } catch (error) {
        throw new Error(e)
    }
})

router.get('/ps/dev-routes/creation-failed', async (req, res) => {
    res.render('creation-failed')
})

module.exports = router;

async function getUrlInfo(req) {
    try {
        if (!req.params[0].startsWith("https")) return new Error("Invalid URL Request")
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
    } catch (error) {
        throw new Error(error)
    }
}