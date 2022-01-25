const router = require('express').Router();
const axios = require('axios');
const Config = require('../../config.json');

async function slow(req, res, next) {
    if(Config.prod == true) {
        const waitTime = Math.round(Math.random() * 100) + 1000;
    await new Promise(r => setTimeout(r, waitTime));
    next();
    } else {
        next();
    }
}

router.get('/', slow, (req,res) => {
    res.json({
        data: '「CLOUDSDALERADIO」ブロードキャストAPI'
    });
})

router.get('/relays', slow, (req, res) => {
    axios.get(`https://broadcaster.cloudsdaleradio.com/api/station/1/`)
    .then((resp) => {
        const mounts = [];
        const data = resp.data;
        for (let i = 0; i < data.mounts.length; i++) {
            mounts.push({
                id: data.mounts[i].id,
                name: data.mounts[i].name,
                url: data.mounts[i].url,
                location: 'JP-jp',
                bitrate: data.mounts[i].bitrate,
                listeners: Math.floor(Math.random() * 500) + data.mounts[i].listeners.total,
            });
        }
        for (let i = 0; i < data.remotes.length; i++) {
            const Name = data.remotes[i].name;
            mounts.push({
                id: data.remotes[i].id,
                name: data.remotes[i].name,
                url: data.remotes[i].url,
                location: Name.startsWith('FR-relay-') || Name.startsWith('FR-Relay-')? 'FR-fr' : 'JP-jp',
                bitrate: data.remotes[i].bitrate,
                listeners: Math.floor(Math.random() * 500) + data.remotes[i].listeners.total,
            });
        }
        res.json(mounts);
    })
    .catch (err => {
        res.json(err.message);
    })
});

router.get('/request/:id', slow, (req, res) => {
    axios.get(`https://broadcaster.cloudsdaleradio.com/api/station/${req.params.id}/requests`)
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