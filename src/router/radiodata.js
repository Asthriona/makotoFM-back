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
        const data = resp.data[0];
        res.json({
            station_count: 1,
            1: {
                id: data.id,
                name: data.name,
                shortcode: data.shortcode,
                front: data.frontend,
                back: data.backend,
                location: 'Tokyo, JAPAN',
                listen: {
                    default: data.listen_url,
                    pls: data.playlist_pls_url,
                    m3u: data.playlist_m3u_url,
                    mount_points: '/api/broadcaster/relays',
                },
                isPublic: data.is_public,

            }
        })
    })
    .catch (err => {
        res.json(err.message);
    })
});


module.exports = router;