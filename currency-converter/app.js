const express = require('express');
const request = require('request');
const cors = require('cors');
const path = require('path');

const app = express()
const apiRouter = express.Router();
const mainRouter = express.Router();

const labstackApiUrl = 'https://api.labstack.com/currency';
const apiKey = process.env.API_KEY;

apiRouter.get('/rates', (req, res) => {
    request({
        url: labstackApiUrl.concat(
            `/rates?base=${req.query.base}`
        ),
        headers: { 'Authorization': `Bearer ${apiKey}` },
    }, 
    (error, response, body) => {
        if (!error) {
            res.json(body);
            return;
        }
    })
});

apiRouter.get('/convert', (req, res) => {
    request.get({
        url: labstackApiUrl.concat(
            `/convert?from=${req.query.from}&to=${req.query.to}&amount=${req.query.amount}`
        ),
        headers: { Authorization: `Bearer ${apiKey}` }
    }, 
    (error, response, body) => {
        if (!error) {
            res.json(body);
            return;
        }
        console.log(error);
    })
});

mainRouter.get(['/', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

mainRouter.get('/rates', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/rates.html'));
});


app.use(cors());
app.use('/api', apiRouter);
app.use('/', mainRouter);
app.use(express.static('public'));

app.listen(3000, () => console.log('Running on localhost:' + 3000));