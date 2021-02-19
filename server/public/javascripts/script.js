const textTemp1 = document.getElementById('temperature_1');
const textTemp2 = document.getElementById('temperature_2');
const textLastRecords1 = document.getElementById('last_records_1');
const textLastRecords2 = document.getElementById('last_records_2');
const input1 = document.getElementById('temperature_1_change_input')
const input2 = document.getElementById('temperature_2_change_input')

// serverin ip adresi
const server_ipa = '25.49.56.236'; 
// istemcilerin ip adresleri...
const client_addresses = ['25.41.144.24:80/', 'localhost:3002/'];


const interval = 2000;
const GMT_3 = 3600000 * 3;

let lastRecords1 = [];
let lastRecords2 = [];
let lastRecords3 = [];
let lastRecords4 = [];

let mydata = {
    ghouses: []
}

let oldTemps = []

function changeTemp1() {
    fetch('http://' + client_addresses[0] + String(input1.value))
        .then(function (response) {
            console.log('Sıcaklık Guncellendi!' + response.text());
        }).catch(function (err) {
            console.error(err);
        });
}

function changeTemp2() {
    fetch('http://' + client_addresses[1] + String(input2.value))
        .then(function (response) {
            console.log('Sıcaklık Guncellendi! ' + response.text());
        }).catch(function (err) {
            console.error(err);
        }) ;
}



function drawChart(linechartMaterial, lastRecords) {

    let drawTemps = [];
    let temp = [];
    
    lastRecords.forEach(e => {
        dt = new Date(e._id)
        temp = [String(dt.getMinutes() + ':' + dt.getSeconds()), e.temp, e.temp]
        drawTemps.push(temp);
    });

    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Tarih');
    data.addColumn('number', 'Sıcaklık');
    data.addColumn({type: 'number', role: 'annotation'})

    data.addRows(
        drawTemps
    );


    let options = {
        
        title: 'Sıcaklık (Celcius)',
        legend: {position: 'bottom'},
        chartArea: {'width': '80%', 'height': '70%'},

        curveType: 'function',
        annotations: {
            textStyle: {
                fontSize: 12,
                bold: true,
                color: '#0000ff'
            }
        },
        hAxis: {
            title: 'Dakika:Saniye',
            textStyle: {
                fontSize: 12
            },
            direction:1, slantedText:true, slantedTextAngle:90
        }

    };

    var chart = new google.visualization.LineChart(document.getElementById(linechartMaterial));
    chart.draw(data, options);
}


// belirli aralıklar ile sunucu'dan sıcaklık bilgilerini getiriyoruz.
function liveUpdate() {
    setInterval(function () {

        tempData1 = undefined;
        tempData2 = undefined;

        fetch('http://' + server_ipa + ':3000/temperature/')
        .then(function (response) {
            return response.text(); // response'un text bölümünu sonraki fonksiyona paslıyoruz.
        })
        .then(function (data) {
            data = JSON.parse(data); // string gelen veriyi json'a pars ediyoruz.
            mydata = data;
        })
        .catch(function (error) { // herhangi bir hata oluşması durumunda konsola hatayı yazdırıyoruz.
            console.log(error);
        });

        textTemp1.textContent = mydata.ghouses[0].temp.toFixed(3); // json veriye erişim çok daha rahat.
        textTemp2.textContent = mydata.ghouses[1].temp.toFixed(3);

        if(mydata.ghouses[0]._id && oldTemps[0] != mydata.ghouses[0].temp) {
            console.log('ghouse 1: ', mydata.ghouses[0]);
            if(lastRecords1.push(mydata.ghouses[0]) > 60){
                lastRecords1.shift();
            }
            let dt = new Date(mydata.ghouses[0]._id)
            if(dt.getSeconds() < 2) {
                if(lastRecords3.push(mydata.ghouses[0]) > 60){
                    lastRecords3.shift();
                }
            }
            let text = '';
            lastRecords1.forEach(t => {
                text += t.temp.toFixed(3) + ' / ';
            });
            textLastRecords1.textContent = text;
            oldTemps[0] = mydata.ghouses[0].temp;
        }
        if(mydata.ghouses[1]._id && oldTemps[1] != mydata.ghouses[1].temp) {
            console.log('ghouse 2: ', mydata.ghouses[1]);
            if(lastRecords2.push(mydata.ghouses[1]) > 60){
                lastRecords2.shift();
            }
            let dt = new Date(mydata.ghouses[1]._id)
            if(dt.getSeconds() < 2) {
                if(lastRecords4.push(mydata.ghouses[1]) > 60){
                    lastRecords4.shift();
                }
            }

            let text = '';
            lastRecords2.forEach(t => {
                text += t.temp.toFixed(3) + ' / ';
            });
            textLastRecords2.textContent = text;
            oldTemps[1] = mydata.ghouses[1].temp;
        }




        google.charts.load('current', {packages:['corechart']});
        google.charts.setOnLoadCallback(drawChart('linechart_material1', lastRecords1));
        google.charts.setOnLoadCallback(drawChart('linechart_material2', lastRecords2));
        google.charts.setOnLoadCallback(drawChart('linechart_material3', lastRecords3));
        google.charts.setOnLoadCallback(drawChart('linechart_material4', lastRecords4));

    }, interval);

}






// html sayfası yüklenmesi başarı ile tamamlandığı anda verileri getirmeye hazırız. 
document.addEventListener('DOMContentLoaded', function () {
    
    input1.value = 25;
    input2.value = 25;

    fetch('http://' + server_ipa + ':3000/temperature/pastMinuteTemp1')
        .then(function (response) {
            console.log('pastMinuteTemp1 Alındı!');
            return response.text(); // response'un text bölümünu sonraki fonksiyona paslıyoruz.
        })
        .then(function (data) {
            data = JSON.parse(data); // string gelen veriyi json'a pars ediyoruz.
            lastRecords1 = data
        })
        .catch(function (error) { // herhangi bir hata oluşması durumunda konsola hatayı yazdırıyoruz.
            console.log(error);
        });

    fetch('http://' + server_ipa + ':3000/temperature/pastMinuteTemp2')
        .then(function (response) {
            console.log('pastMinuteTemp1 Alındı!');
            return response.text(); // response'un text bölümünu sonraki fonksiyona paslıyoruz.
        })
        .then(function (data) {
            data = JSON.parse(data); // string gelen veriyi json'a pars ediyoruz.
            lastRecords2 = data
        })
        .catch(function (error) { // herhangi bir hata oluşması durumunda konsola hatayı yazdırıyoruz.
            console.log(error);
        });

    fetch('http://' + server_ipa + ':3000/temperature/pastHourTemp1')
        .then(function (response) {
            console.log('pastMinuteTemp1 Alındı!');
            return response.text(); // response'un text bölümünu sonraki fonksiyona paslıyoruz.
        })
        .then(function (data) {
            data = JSON.parse(data); // string gelen veriyi json'a pars ediyoruz.
            lastRecords3 = data
        })
        .catch(function (error) { // herhangi bir hata oluşması durumunda konsola hatayı yazdırıyoruz.
            console.log(error);
        });

    fetch('http://' + server_ipa + ':3000/temperature/pastHourTemp2')
        .then(function (response) {
            console.log('pastMinuteTemp1 Alındı!');
            return response.text(); // response'un text bölümünu sonraki fonksiyona paslıyoruz.
        })
        .then(function (data) {
            data = JSON.parse(data); // string gelen veriyi json'a pars ediyoruz.
            lastRecords4 = data
        })
        .catch(function (error) { // herhangi bir hata oluşması durumunda konsola hatayı yazdırıyoruz.
            console.log(error);
        });


    liveUpdate();
});