const db = require('./database');
const ObjectId = require('mongodb').ObjectID;
const config = require('../config');


var num = 1;

setInterval(function ScanSubscript() {
  var isodate = new Date().toISOString();//Текущая дата

    console.log("OKdata" ,isodate);
  db.connect((err) {
    if (err) {
      return console.log(err);
    }

    db.get().collection('subscriptions').find({active: true}).toArray(function(err, result) {
      if (err) {
        return console.log(err);;
      }
    //  console.log('_________'+isodate+'_____________', num++);
      for (var i = 0; i < result.length; i++) {
        var curentdata = new Date(result[i].end_date).toISOString();
            if(curentdata < isodate){
                console.log(result[i].end_date);
                Drop(result[i]._id);
            }
          }
        })
      })
  }, 500);


function Drop(id) {
  db.get().collection('subscriptions').updateOne({ _id: ObjectId(id) },  { $set:{ active: false }},
    function (err, result) {
      if(err){
        return console.log(err);
      }
      // request.get(`${url}/api/lock/key${key}@inet`, function(err, httpResponse, body) {
      //   if (body.sucess === false) {
      //     return cd(err);
      //   }
      //   console.log(body);
      // })
      console.log('user deaktivated');
    }
  )
}
