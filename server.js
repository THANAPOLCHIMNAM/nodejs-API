var express = require('./config/express')
var service = require('./blockchain/service')
var app = express()
// var mongoose = require('./config/mongoose')
// var db = mongoose();

new service().INIT();



const port = process.env.PORT || 4444
app.listen(port, () => {
  console.log('Start server at port ' + port)
})
