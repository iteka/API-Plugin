const express = require('express');
const BodyPparser = require('body-parser');
const db = require('./controllerts/database');
const Controller = require('./controllerts/controller');
const Services = require('./services/services');
const config = require('./config');

var app = express();

app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));

app.get('/', function (req, res) {
  res.send('Access Denied');
})


app.post('/createdemo', Services.CreateDemo);

app.post('/payments', Controller.Payments);

app.get('/find/:id', Controller.FindConsole);

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
    app.listen(322, function () {
      console.log('API Started');
    })
})
