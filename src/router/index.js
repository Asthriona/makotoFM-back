const router = require('express').Router();
const axios = require('axios');

const Config = require('../../config.json');

//Routes files
const broadcaster = require('./broadcaster.js');
const nowPlaying = require('./nowplaying.js');
const radioData = require('./radiodata.js');

// Set routes
router.use('/broadcaster', broadcaster);
router.use('/player', nowPlaying);
router.use('/radio', radioData);

router.get('/', function (req, res) {
    res.json({
        message: '「CLOUDSDALE RADIO」APIへようこそ',
        staff: 'あなたはスタッフではないので、ここではビジネスを持っていません。ウェブサイトに戻ってください。',
        hosting: '「ASTHRIONA」株式会社',
        version: 'v8.0.0',
        url: 'https://cloudsdaleradio.com/',
    });
});

module.exports = router;