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
    axios.get(`https://${Config.radioAPI}/stations`)
    .then((resp) => {
        const data = resp.data;
        let stations = [];
        for (let i = 0; i < data.length; i++) {
            stations.push({
                id: data[i].id,
                name: data[i].name,
                shortcode: data[i].shortcode,
                location: "Tokyo, Japan",
                listen: {
                    default: data[i].listen_url,
                    pls: data[i].playlist_pls_url,
                    m3u: data[i].playlist_m3u_url,
                    mount_points: "/api/broadcaster/relays",
                },
                isPublic: data[i].is_public,
            });
        };
        res.json(stations);
    })
    .catch (err => {
        res.json(err.message);
    })
});


module.exports = router;