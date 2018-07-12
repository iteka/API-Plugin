exports.UpdateSubscriptions = function (Subscripts) {
    Models.createSubscript(Subscripts, function(err, doc) {
          if (err) {
            console.log(err);
          return err;
          }
      cb(doc)

    })
  }
}
