const express = require('express');
const router = express.Router();
const MyDate = require('../Date');
const GMT_3 = 3600000 * 3;

// mongoose models
const Greenhouse1 = require('../mongoose/models/Greenhouse').Greenhouse1;
const Greenhouse2 = require('../mongoose/models/Greenhouse').Greenhouse2;

function now () {
    return new Date(Date.now() + GMT_3);
}

let mydata = {
    ghouses: [
        {
            _id: undefined,
            temp: undefined
        },
        {
            _id: undefined,
            temp: undefined
        }
    ]
}


/* GET home page. */
router.get('/getValue_1/:temp', (req, res) => {
    mydata.ghouses[0].temp = parseFloat(req.params.temp);
    mydata.ghouses[0]._id = now() // Date.now() gives the date by milliseconds according to gmt+0
    greenhouse1 = new Greenhouse1({
        _id: mydata.ghouses[0]._id,
        temp: mydata.ghouses[0].temp
    });

    greenhouse1.save((err, data) => {
        if(err)
            console.log('Error Sera1: ', err);
    });
    res.send('Successfully Received_1!');
});

router.get('/getValue_2/:temp', (req, res) => {
    mydata.ghouses[1].temp = parseFloat(req.params.temp);
    mydata.ghouses[1]._id = now()// Date.now() gives the date by milliseconds according to gmt+0
    greenhouse2 = new Greenhouse2({
        _id: mydata.ghouses[1]._id,
        temp: mydata.ghouses[1].temp
    });

    greenhouse2.save((err, data) => {
        if(err)
            console.log('Error Sera2: ', err);
    });
    res.send('Successfully Received_2!');
});

router.get('/show', (req, res) => {  
    res.send('\nTemperature_1: ' + mydata.ghouses[0].temp + ' - Temperature_2: ' + mydata.ghouses[1].temp);
});

router.get('/', (req, res) => {  
    res.json(mydata);
});


/* ----- SON 2 DAKİKA VERİLERİ ----- */
router.get('/pastMinuteTemp1', (req, res) => {
    Greenhouse1.find({}, 'temp', (err, data) => {
        res.json(data);
    }).find({'_id': { $gt: (now() - 120 * 1000 - 900) }}); // son 2 dakika kayıtları!
});

router.get('/pastMinuteTemp2', (req, res) => {
    Greenhouse2.find({}, 'temp', (err, data) => {
        res.json(data);
    }).find({'_id': { $gt: (now() - 120 * 1000 - 900) }}); // son 2 dakika kayıtları!
});


/* ----- SON 1 SAAT VERİLERİ ----- */
router.get('/pastHourTemp1', (req, res) => {
    Greenhouse1.find({}, 'temp', (err, data) => {
        let modified = [];
        let d_old = -1;
        data.forEach(d => {
            if(d._id.getMinutes() != d_old)
                modified.push(d)

            d_old = d._id.getMinutes();
        });
        res.json(modified);
    }).find({'_id': { $gt: (now() - 36000 * 1000 - 900) }}); // son 1 saat kayıtları!
});

router.get('/pastHourTemp2', (req, res) => {
    Greenhouse2.find({}, 'temp', (err, data) => {
        let modified = [];
        let d_old = -1;
        data.forEach(d => {
            if(d._id.getMinutes() != d_old)
                modified.push(d)

            d_old = d._id.getMinutes();
        });
        res.json(modified);
    }).find({'_id': { $gt: (now() - 3600 * 1000 - 900) }}); // son 1 saat kayıtları!
});

module.exports = router;