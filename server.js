const express = require('express');
const BodyPparser = require('body-parser');
const db = require('./controllerts/database');
const Controller = require('./controllerts/controller');
const mail = require('./email/email');
const Pay = require('./pay/payment');
const Services = require('./services/services');
const config = require('./config');
var path = require('path');
var engines = require('consolidate');

var app = express();

app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));


//app.use(express.static(path.join(__dirname, 'views')));
// app.set('views', __dirname + '/views');
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');
//
// app.get('/admin', function (req, res) {
//   res.render('index.html');
// })
//app.use(express.static(path.join(__dirname, '/admin')));

app.get('/', function (req, res) {
  res.send('Access Denied');
})

app.post('/createuser', Services.CreateUser);//+++++++++++++++++++++

app.post('/gotoplay', Services.GoToPlay);//+++++++++++++++++++++

app.post('/createdemo', Services.CreateDemo); //++++++++++++++++++++

app.post('/createdemoHistory', Controller.CreateDemoHistory);
app.post('/CheckDemoHistory', Controller.CheckDemoHistory);

app.post('/paymenthistory', Services.Paymenthistory);

app.post('/extendpay', Services.extend);//ПРОДЛИТЬ

app.post('sendmailInfo', mail.SendInfomail);



app.post('/payqiwi', Pay.Qiwi);


app.post('/ps4auth',function (req, res) {
console.log(req);
console.log(res);

});


db.connect(config.url.Mongo, function (err) {
    if(err){
      return console.log(err);
    }
    app.listen(3232, function () {
      console.log('API Started');
    })
})
