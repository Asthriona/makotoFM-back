const router = require('express').Router();
const axios = require('axios');
const moment = require('moment');
const Config = require('../../config.json');
const tz = require('moment-timezone');

router.get('/', (req, res) => {
    res.json({
        data: '「CLOUDSDALERADIO」プレーヤーデータ'
    });
})
router.get('/nowplaying', (req, res) => {
    axios.get(`https://${Config.radioAPI}/nowplaying/1/`)
    .then(resp => {
        const data = resp.data;
        const np = data.now_playing.song;
        res.json({
            isLive: data.live.is_live == true? {live: true, streamer_name: data.live.streamer_name} : false,
            isRequest: data.is_request,
            id: np.id,
            title: np.title,
            artist: np.artist,
            album: np.album,
            art: np.art,
        })
    })
    .catch(err => {
        console.error(err.message);
        return res.json({ 
            isLive: false,
            isRequest: false,
            id: '',
            title: `${err.message}`,
            artist: 'Cloudsdale Radio',
            album: '',
            art: '',
        })
    })
});
router.get('/playingnext', (req, res) => {
    axios.get(`https://${Config.radioAPI}/nowplaying/1/`)
    .then(resp => {
        const data = resp.data;
        const np = data.playing_next.song;
        res.json({
            isLive: data.live.is_live == true? {live: true, streamer_name: data.live.streamer_name} : false,
            isRequest: np.is_request || false,
            id: np.id,
            title: np.title,
            artist: np.artist,
            album: np.album,
            art: np.art,
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
    axios.get(`https://${Config.radioAPI}/nowplaying/1/`)
    .then(resp => {
        const data = resp.data;
        const history = [];
        data.song_history.forEach(played => {
            history.push({
                id: played.song.id,
                title: played.song.title,
                artist: played.song.artist,
                album: played.song.album,
                art: played.song.art,
                played_at: moment(played.played_at * 1000).tz('Asia/Tokyo'),
                requested: played.is_request
            })
        });
        res.json(history);
    })
});

module.exports = router;