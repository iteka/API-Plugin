const express = require('express');
const BodyPparser = require('body-parser');
const db = require('./controllerts/database');
const Controller = require('./controllerts/controller');
const mail = require('./Email/email');
const Pay = require('./pay/payment');
const Services = require('./services/services');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const engines = require('consolidate');


var cors = require('cors');
var app = express();

app.use(cors());

app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));




app.get('/', function (req, res) {
  res.send('Access Denied');
})

app.post('/createuser', Services.CreateUser); // email = > jwt
app.post('/createdemo', Services.CreateDemo); // uid | consoleGroup => 200

app.post('/gotoplay', Services.GoToPlay);//uid => 200

app.post('/createdemoHistory', Controller.CreateDemoHistory);// fprint | uid => 200
app.get('/checkdemohistory/:uid/:fprint', Controller.CheckDemoHistory); // uid => true | false

app.post('/paymenthistory', Services.Paymenthistory); // uid = > name / price / status / active / subscriptions { start_date/ end_date }

app.post('/extendpay', Services.extend);//купить такую же подписку subscriptions => https://qiwi.com/payment/

//app.post('sendmailInfo', mail.SendInfomail);

app.post('/getovpkey', Controller.GetVpnKey);// User id => status, key

app.post('/payqiwi', Pay.Qiwi);

app.get('/version/:ver', Controller.Version);

app.post('/paystatus', Controller.paystatus);


app.get('/error', function (req, res) {
  let EJ = fs.readFileSync('./log/error.log', 'utf8');
  res.send(EJ);
})

db.connect(config.url.Mongo, function (err) {
    if(err){
      return console.log(err);
    }
    app.listen(3232, function () {
      console.log('API Started');
   })
})
