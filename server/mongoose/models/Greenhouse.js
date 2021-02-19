const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Greenhouse = new Schema({
    _id: Date,
    temp: Number
});

module.exports = {
    Greenhouse1: mongoose.model('Greenhouse1', Greenhouse)
    ,Greenhouse2: mongoose.model('Greenhouse2', Greenhouse)
    //,Greenhouse3: mongoose.model('Greenhouse3', Greenhouse)
    //,Greenhouse4: mongoose.model('Greenhouse4', Greenhouse)
}
