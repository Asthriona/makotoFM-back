const router = require('express').Router();
const axios = require('axios');
const Config = require('../../config.json');

router.get('/', (req,res) => {
    res.json({
        data: '「CLOUDSDALERADIO」プレーヤーデータ'
    });
});

// GET list of station and location set as JP
router.get('/stations', (req, res) => {
    axios.get(`${Config.radioAPI}/stations`)
    .then((resp) => {
        const data = resp.data;
        const station = [];
        data.forEach( s => {
            station.push({
                station: {
                    id: s.id,
                name: s.name,
                shortcode: s.shortcode,
                description: s.description,
                backend: s.backend,
                frontend: s.frontend,
                url: s.url,
                listener: Math.round(Math.random() * 999)
                },
            })
        });
        res.json(station);
    })
    .catch (err => {
        res.status(500).json({
            message: "An error happened while trying to get the stations informations.",
            error: err.message
        });
    });
    })
    router.get("/station/:Id", async (req,res) => {
        const status = await axios.get(`https://broadcaster.cloudsdaleradio.com/api/status`)
        const time = await axios.get(`https://broadcaster.cloudsdaleradio.com/api/time`)
        axios.get(`${Config.radioHost}/api/nowplaying/${req.params.Id}`)
        .then((resp) => {
            const data = resp.data;
            const stationMounts = [];
            data.station.remotes.forEach(remote => {
                console.log(remote.bitrate)
                stationMounts.push({
                    broadcasterId: 1,
                    mountId: remote.id,
                    name: remote.name,
                    url: remote.url,
                    bitrate: remote.bitrate,
                    format: remote.format,
                    type: remote.bitrate == null ? "remote relay" : "relay",
                    m3u: `${remote.url}.m3u`,
                    xspf: `${remote.url}.xspf`
                })
            });
            res.json({
                broadcaster: {
                    id: 1,
                    status: status.data.online ? "online" : "offline",
                    name: "SMN | Fubuki",
                    location: "Asia/Japan",
                    datacenter: "Tokyo-3",
                    url: "broadcaster.cloudsdaleradio.com",
                    time: {
                        timestamp: time.data.timestamp,
                        utcFullTime: time.data.datetime,
                        utcDate: time.data.utc_date,
                        utcTime: time.data.utc_time,
                        timezone: "Asia/Japan"
                    }
                },
                station: {
                    id: data.station.id,
                    name: data.station.name,
                    shortcode: data.station.shortcode,
                    description: data.station.description,
                    url: data.station.url,
                    listenUrl: data.station.remotes[0].url,
                    isPublic: data.station.is_public,
                    listener: data.listeners.total
                },
                mounts: stationMounts,
                streams: {
                    hls: {
                        isEnabled: false,
                        url: null
                    }
                }
            })
        })
        .catch((err) => {
            res.status(err.response.data.code).json({
                message: "This station might be offline.",
                error: `${err.response.data.code} - ${err.message}`
            })
        })
    })


module.exports = router;