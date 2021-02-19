const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();


const ipa = '25.41.144.24'; // hamachi ipv4 adresinizi buraya yazınız.
const port = 80;

const server_origin = 'http://25.49.56.236:3000'


app.use(cors());


let temperature = 0;


sendData = (address) => {

    // dosyadan sıcaklığı oku servere gönder
    fs.readFile('data.txt', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        temperature = parseFloat(data);
        console.log('temperature:', temperature);
      });

    address = address + String(temperature)
    fetch(address)
        .then(res => res.text())
        .then(body => console.log(body));
};

setInterval(sendData, 2000, server_origin + '/temperature/getValue_1/')

app.use('/:new_temperature', (req, res) => {

    // serverden gelen sıcaklığı dosyaya yaz
    fs.writeFile('deneme.txt', req.params.new_temperature, function (err) {
        if (err) return console.log(err);
      });

    console.log('Yeni Sicaklik: ' + req.params.new_temperature);
    res.status(200)
    res.end()
});



app.listen(port, ipa)
