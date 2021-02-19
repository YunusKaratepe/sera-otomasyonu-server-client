const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

const server_ipa = 'localhost';
const port = 3002;
const server_origin = 'http://' + server_ipa + ':3000'

app.use(cors({
    origin: server_origin
}));

let temperature = 20;
sendData = (address) => {
    address = address + String(temperature + Math.random() * 0.1);
    fetch(address)
        .then(res => res.text())
        .then(body => console.log(body));
};

setInterval(sendData, 2000, server_origin + '/temperature/getValue_2/')

app.use('/:new_temperature', (req, res) => {
    console.log('Yeni Sicaklik: ' + req.params.new_temperature);
    temperature = parseInt(req.params.new_temperature)
    res.status(200)
    res.end()
});


app.listen(port, server_ipa)
