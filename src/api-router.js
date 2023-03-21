const { Router } = require('express');
const router = Router();

const info = require('../lib/getUrlInfo')

router.get('/new/*', async (req, res) => {
    const { url, hostname, platform, playlistid } = await getUrlInfo(req)
    console.log(url)

    // res.json({ playlistUrl: url, hostname, platform, playlistid })
    // res.render('index', { url, hostname, platform, playlistid })
    res.redirect(`/playlist?plstid=${playlistid}&hostname=${hostname}&platform=${platform}`)
    console.log(platform)
})

router.get('/playlist', async (req, res) => {
    console.log(req.query)
    res.render('new-playlist', { platform: req.query.platform, plstid: req.query.plstid })
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