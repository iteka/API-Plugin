require('dotenv').config();
const express      = require('express');
const BodyPparser  = require('body-parser');
const db           = require('./controllerts/database');
const cors         = require('cors');
const routes       = require('./server/routes');
const loger        = require('./log/loger');
const cookieParser = require('cookie-parser');
const Servicess    = require('./user/service');

const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));

routes(app);
app.get('/log/err', loger.Logrout.error);
app.get('/log/all', loger.Logrout.combined);

app.use((err, req, res, next) => {
  const NotFond = ~err.message.indexOf('Cannot GET');
  const MongoDB = ~err.message.indexOf('Error 500- ObjectId');
  const TokenError = ~err.message.indexOf('JsonWebTokenError');
  console.log(err.stack);

  if(err.message == "invalid token"){
      loger.logger.error(err.stack);
    return res.send(401, {"error": "invalid Auth token"})
  }

  if(err.message == "ReferenceError"){
      loger.logger.error(err.stack);
    return res.send(500, {"error": "Error"})
  }
console.log("err.messageerr sage--: ", ~err.message.indexOf('Error: Argument passed in must'));

  // if(err.message.indexOf('Error: Argument passed in must')){
  //   loger.logger.error(err.stack);
  // return res.send(404, {"error": "ObjectID"})
  // }

  if(err.message && (NotFond || MongoDB)){
    return next();
  }

    loger.logger.error(err.stack);
    res.send(500, {"error": err.stack})
});

app.use((req, res) => {
  res.json({
    "statusCode": 404,
    "error": "Not Found",
    "message": "Not Found"
  });
});

db.connect((err) => {
    if(err){
      return console.log(err);
    }
    app.listen(port, function () {
      console.log(`API Started ${port}`);
   })
})
