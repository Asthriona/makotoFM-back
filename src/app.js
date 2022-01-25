const express = require('express');
const Config = require('../config.json')
const path = require('path');
const cors = require('cors');
const app = express();

// cors allow all requests
app.use(cors());

// declare router files
const indexRoutes = require('./router/index');

// set routes
app.use('/api', indexRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(Config.port, console.log(`Server is running on port ${Config.port}`));