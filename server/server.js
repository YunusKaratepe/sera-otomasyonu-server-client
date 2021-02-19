const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const temperaturesRouter = require('./routes/temperature');
const aboutsRouter = require('./routes/about');

const app = express();

app.use(cors());

db = mongoose.connect('mongodb://localhost/temperatures', { useNewUrlParser: true, useUnifiedTopology: true });



mongoose.connection.on('open', () => {
  console.log('MongoDB Baglanti Saglandi');
});
mongoose.connection.on('error', (err) => {
  console.log('error: MongoDB Baglanti Hatasi\n', err);
});

//mongoose.connection.close();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/temperature', temperaturesRouter);
app.use('/about', aboutsRouter)


app.get('/monitor', (req, res) => {
  res.render('monitor')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const port = 3000;
const ip_a = '25.49.56.236';
// const ip_a = 'localhost';

app.listen(port, ip_a);


module.exports = app;
