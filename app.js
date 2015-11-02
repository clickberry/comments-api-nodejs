var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');

var config = require('./config');
var routes = require('./routes/index')(passport);

mongoose.connect(config.get('mongodb:connection'));

require('./config/passport/jwt-passport')(passport);

var app = express();

// Configure CORS
app.use(require('cors')({allowedHeaders: 'Authorization, Content-Type'}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(passport.initialize());
//app.use(passport.session());

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if(res.statusCode===500){
            console.log(err.message);
            console.log(err.stack);
        }
        res.send({
            message: err.message,
            error: {}
        });
    });
}else {
// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
