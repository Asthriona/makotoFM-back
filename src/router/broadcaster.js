const router = require('express').Router();
const axios = require('axios');
const Config = require('../../config.json');
const moment = require('moment');

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
        data: '「CLOUDSDALE RADIO」ブロードキャストAPI'
    });
})

let listeners;
let listeners_max = 500;
let listeners_min = 0;
let lastUdate

function getListeners() {
    // get last value cached
    const last = listeners;
    if(listeners == 0 || listeners == undefined) { listeners = Math.round(Math.random() * listeners_max) + listeners_min; }
    // check if last update is more than 5mn
    const now = moment();
    const diff = now.diff(lastUdate, 'minutes');
    if(diff > 5) {
        // randomly add or remove to listeners
        const rand = Math.round(Math.random() * 100);
        if(rand > 50) {
            listeners += Math.round(Math.random() * 20);
            lastUdate = now;
        } else {
            listeners -= Math.round(Math.random() * 20);
            lastUdate = now;
        }
        console.log(`Listeners: ${listeners}`);
        return listeners;

} else {
    console.log(`Listeners: ${listeners}`);
    return last;
    }
}
console.log(getListeners());
router.get('/relays', slow, (req, res) => {
    axios.get(`https://broadcaster.cloudsdaleradio.com/api/station/1`)
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
                listeners: getListeners() + data.mounts[i].listeners.total,
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
                listeners: getListeners() + data.remotes[i].listeners.total,
            });
        }
        console.log(mounts);
        res.json(mounts);
    })
    .catch (err => {
        res.json(err.message);
    })
});

router.get('/request/:id', slow, (req, res) => {
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