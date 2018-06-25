const express = require('express');
const BodyPparser = require('body-parser');
var db = require('./config/dbconf');
var Controller = require('./controllerts/controller');
var Services = require('./services/services');

var app = express();
app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));

app.get('/', function (req, res) {
  res.send('HI API');
})


app.post('/createdemo', Services.CreateDemo);

// app.get('/consoles/:id', Controller.findID);
//
// app.post('/vpncredentials', Controller.createVpncredentials);
//
// app.post('/subscript', Controller.createSubscript);
//
//
// app.put('/update/:id', Controller.update);


db.connect('mongodb://localhost/IT-API', function (err) {
    if(err){
      return console.log(err);
    }
    app.listen(3000, function () {
      console.log('API Started');
    })
})
