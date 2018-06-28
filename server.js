const express = require('express');
const BodyPparser = require('body-parser');
const db = require('./controllerts/database');
const Controller = require('./controllerts/controller');
const Pay = require('./controllerts/payment');
const PayChek = require('./controllerts/paychek');
const Services = require('./services/services');
const config = require('./config');
var path = require('path');
var uid = require('node-machine-id');
var engines = require('consolidate');

var app = express();

app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));

//app.use(express.static(path.join(__dirname, 'views')));
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/admin', function (req, res) {
  res.render('index.html');
})

app.use(express.static(path.join(__dirname, '/admin')));


app.post('/reg', Services.CreateUser);







// app.get('/', function (req, res) {
//   res.send('Access Denied');
// })
//
//
// app.post('/createdemo', Services.CreateDemo);
//
// app.post('/cosolefind/', Controller.FindConsole)
//
// app.get('/chek', PayChek.QiviCheck);
//
//
// app.get('/admin', function (req, res) {
//   res.sendFile( __dirname + '/admin/examples/dashboard.html');
// })
// app.get('/consoles/:id', Controller.findID);
//
// app.post('/vpncredentials', Controller.createVpncredentials);
//
// app.post('/subscript', Controller.createSubscript);
//
//
// app.put('/update/:id', Controller.update);


db.connect(config.url.Mongo, function (err) {
    if(err){
      return console.log(err);
    }
    app.listen(3232, function () {
      console.log('API Started');
    })
})
