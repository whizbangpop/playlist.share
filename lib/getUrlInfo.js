/** Strips the URL info from a ExpressJS request */
module.exports = function getUrlInfo(req) {
    let url = new URL(req.params[0])
    let hostname = url.hostname
    let platform;
    let playlistid;

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