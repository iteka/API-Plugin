//    host: 'http://10.1.0.1//api/gencli/Kaspertestkeysikserv@inet',
    var http = require('http');

    var request = require('request');

var urls = "http://10.1.0.1/api/gencli/";

    request({
        url: urls,
        method: "POST",
        json: {srv: "inet", cli: "ESTdKdd12"}
    }, function(err,httpResponse,body){
      console.log('body:', httpResponse);
    })



//
// request.post({url:'http://10.1.0.1/api/gencli/',
// // headers: [
// //         {
// //           name: 'Content-Type',
// //           value: 'application/json'
// //         }
// //       ],
// form: {
//   srv: "inet",
//   cli: "ESTdK12"
// }
// }, function(err,httpResponse,body){
//   console.log('body:', body);
// })

    //
    // request.post('http://10.1.0.1/api/gencli/',
    //   data:{
    //     "srv": "inet",
    //     "cli": "ESTK12"
    //   },
    //
    //  function (error, response, body) {
    //   // console.log('error:', error); // Print the error if one occurred
    //   // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //   console.log('body:', body); // Print the HTML for the Google homepage.
    // });
