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
    axios.get(`${Config.radioHost}/api/station/1/`)
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

router.get('/status', async (req,res) => {
    // Get the status of both relays https://frRelay.cloudsdaleradio.com/ and https://jp-broadcaster.cloudsdaleradio.com/
    const frRelay = await axios.get('https://frRelay.cloudsdaleradio.com/status-json.xsl');
    const jpRelay = await axios.get('https://jp-broadcaster.cloudsdaleradio.com/status-json.xsl');
    const frRelayData = frRelay.data.icestats.source;
    const jpRelayData = jpRelay.data.icestats.source;
    const frRelayMounts = [];
    const jpRelayMounts = [];
    for (let i = 0; i < frRelayData.length; i++) {
        frRelayMounts.push({
            name: `${frRelayData[i].server_name} @ ${frRelayData[i].bitrate}`,
            url: frRelayData[i].listenurl.replace('http://localhost:8000', 'https://frRelay.cloudsdaleradio.com'),
            location: 'FR-fr',
            bitrate: frRelayData[i].bitrate,
            listeners: frRelayData[i].listeners,
        });
    }
    for (let i = 0; i < jpRelayData.length; i++) {
        jpRelayMounts.push({
            name: `${jpRelayData[i].server_name} @ ${jpRelayData[i].bitrate}`,
            url: jpRelayData[i].listenurl.replace('http://main-broadcaster.cloudsdaleradio.com:8000', 'https://jp-broadcaster.cloudsdaleradio.com'),
            location: 'JP-jp',
            bitrate: jpRelayData[i].bitrate,
            listeners: jpRelayData[i].listeners,
        });
    }
    res.json({
        frRelay: frRelayMounts,
        jpRelay: jpRelayMounts,
    });
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