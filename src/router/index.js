const router = require('express').Router();
const axios = require('axios');

const Config = require('../../config.json');

//Routes files
const broadcaster = require('./broadcaster.js');
const nowPlaying = require('./nowPlaying.js');
const radioData = require('./radioData.js');

// Set routes
router.use('/broadcaster', broadcaster);
router.use('/player', nowPlaying);
router.use('/radio', radioData);

router.get('/', function (req, res) {
    res.json({
        message: '「CLOUDSDALE RADIO」APIへようこそ',
        staff: 'あなたはスタッフではないので、ここではビジネスを持っていません。ウェブサイトに戻ってください。',
        hosting: '「COVER」が主催',
        version: 'v8.0.0',
        url: 'https://cloudsdaleradio.com/',
    });
});

module.exports = router;