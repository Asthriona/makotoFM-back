const router = require('express').Router();
const axios = require('axios');
const Config = require('../../config.json');
const moment = require('moment');

router.get('/', (req,res) => {
    res.json({
        data: '「CLOUDSDALE RADIO」ブロードキャストAPI'
    });
});

router.get('/relays', (req, res) => {
    axios.get(`https://${Config.radioAPI}/station/1/`)
    .then((resp) => {
        const mounts = [];
        const data = resp.data;
        for (let i = 0; i < data.mounts.length; i++) {
            mounts.push({
                id: data.mounts[i].id,
                name: data.mounts[i].name,
                url: "https://frRelay.cloudsdaleradio.com/fr-relay-128.mp3",
                location: 'FR-fr',
                bitrate: data.mounts[i].bitrate,
                listeners: data.mounts[i].listeners.total,
            });
        }
        for (let i = 0; i < data.remotes.length; i++) {
            const Name = data.remotes[i].name;
            const Url = data.remotes[i].url.replace('http://lyra.asthriona.com:8000', 'https://frRelay.cloudsdaleradio.com');
            mounts.push({
                id: data.remotes[i].id,
                name: data.remotes[i].name,
                url: Url,
                location: Name.startsWith('Cloudsdale') || Name.startsWith('FR-Relay-')? 'FR-fr' : 'JP-jp',
                bitrate: data.remotes[i].bitrate,
                listeners: data.remotes[i].listeners.total,
            });
        }
        res.json(mounts);
    })
    .catch (err => {
        res.json(err.message);
    })
});

router.get('/request/:id', (req, res) => {
    axios.get(`https://${Config.radioAPI}/station/${req.params.id}/requests`)
    .then(resp => {
        const data = resp.data;
        const requests = [];
        for (let i = 0; i < data.length; i++) {
            requests.push({
                requestId: data[i].request_id,
                id: data[i].song.id,
                title: data[i].song.title,
                artist: data[i].song.artist,
                album: data[i].song.album,
                art: data[i].song.art,
            });
        }
        res.json(requests);
    })
})

module.exports = router;