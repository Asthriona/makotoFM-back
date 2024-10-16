const router = require('express').Router();
const axios = require('axios');
const moment = require('moment');
const Config = require('../../config.json');
const tz = require('moment-timezone');

router.get('/', (req, res) => {
    axios.get(`${Config.radioAPI}stations`)
    .then((resp) => {
        const stations = [];
        const data = resp.data;
        data.forEach(s => {
            stations.push({
                stationId: s.id,
                name: s.name,
                shortcode: s.shortcode,
                description: s.description,
                frontend: s.frontend,
                backend: s.backend,
            });
        });
        res.json({
            data: '「CLOUDSDALERADIO」プレーヤーデータ',
            information: "Each broadcaster may host multiple stations, to get a specific station, please use a query such as '?sid=1', if no option is passed the default is station 1.",
            stations,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong.",
            err: err.message,
        })
    })
})
router.get('/nowplaying', (req, res) => {
    axios.get(`${Config.radioHost}/api/nowplaying/${req.query.sid || 1}/`)
        .then(resp => {
            const data = resp.data;
            const np = data.now_playing.song;
            const next = data.playing_next.song
            res.json({
                listeners: resp.data.listeners.unique,
                now: {
                    stationId: data.station.id,
                    isLive: data.live.is_live == true ? { live: true, streamer_name: data.live.streamer_name } : false,
                    isRequest: data.is_request || false,
                    id: np.id,
                    title: np.title,
                    artist: np.artist,
                    album: np.album,
                    art: np.art,
                },
                next: {
                    stationId: data.station.id,
                    isLive: data.live.is_live == true ? { live: true, streamer_name: data.live.streamer_name } : false,
                    isRequest: next.is_request || false,
                    id: next.id,
                    title: next.title,
                    artist: next.artist,
                    album: next.album,
                    art: next.art,
                    played_at: moment(data.playing_next.played_at * 1000).tz('Asia/Tokyo'),
                    played_ago: moment(data.playing_next.played_at * 1000).fromNow(),
                }
            })
        })
        .catch(err => {
            console.error(err);
            return res.json({
                stationId: 0,
                isLive: false,
                isRequest: false,
                id: '',
                title: `エラーが発生しました。`,
                artist: 'Sora Media Network',
                album: '',
                art: '',
            })
        })
});
// Rescue Stream meta data:
router.get('/rescue', (req, res) => {
    axios.get('https://frRelay.cloudsdaleradio.com/status-json.xsl')
        .then((resp) => {
            const data = resp.data.icestats.source[0];
            const title = data.title.split("-")[1].trim()
            const artist = data.title.split("-")[0].trim()
            res.json({
                    isLive: false,
                    isRequest: false,
                    id: '0',
                    title: title || 'Rescue Stream',
                    artist: artist || null,
                    album: '',
                    art: 'https://cdn.asthriona.com/i/2022/08/_pn_220815_0628AM07114.png',
            })
        })
});
router.get('/playingnext', (req, res) => {
    axios.get(`${Config.radioHost}/api/nowplaying/${req.query.sid || 1}/`)
        .then(resp => {
            const data = resp.data;
            const np = data.playing_next.song;
            res.json({
                stationId: data.station.id,
                isLive: data.live.is_live == true ? { live: true, streamer_name: data.live.streamer_name } : false,
                isRequest: np.is_request || false,
                id: np.id,
                title: np.title,
                artist: np.artist,
                album: np.album,
                art: np.art,
                played_at: moment(data.playing_next.played_at * 1000).tz('Asia/Tokyo'),
                played_ago: moment(data.playing_next.played_at * 1000).fromNow(),
            })
        })
        .catch(err => {
            console.log(err.message);
            return res.json({
                isLive: false,
                isRequest: false,
                id: '',
                title: 'Request Delayed. (Error 1018)',
                artist: 'Cloudsdale Radio',
                album: '',
                art: '',
            })
        })
});

router.get('/history', (req, res) => {
    axios.get(`${Config.radioHost}/api/nowplaying/${req.query.sid || 1}/`)
        .then(resp => {
            const data = resp.data;
            const history = [];
            data.song_history.forEach(played => {
                history.push({
                    stationId: data.station.id,
                    id: played.song.id,
                    title: played.song.title,
                    artist: played.song.artist,
                    album: played.song.album,
                    art: played.song.art,
                    played_at: moment(played.played_at * 1000).tz('Asia/Tokyo'),
                    played_ago: moment(played.played_at * 1000).fromNow(),
                    isRequest: played.is_request
                })
            });
            res.json(history);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        })
});

module.exports = router;