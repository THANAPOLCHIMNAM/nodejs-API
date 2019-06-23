module.exports = function (app) {
    var request = require('../controller/serviec_request')

//adduser
    app.post('/getDate',async(req, res) =>{
    var result = await new request().getDate()
    res.json(result)
    })  
    app.post ('/blockchain/register',async(req, res) =>{
    var result = await new request().register(req.body)
    res.json(result)
    })  


    app.post ('/createUser',async(req, res) =>{
    var result = await new request().createUser(req.body)
    res.json(result)
    })  
    app.post ('/createwallet',async(req, res) =>{
    var result = await new request().createwallet(req.body)
    res.json(result)
    })
    app.post ('/query',async(req, res) =>{
    var result = await new request().query(req.body)
    res.json(result)
    }) 
    app.post ('/queryuser',async(req, res) =>{
    var result = await new request().queryuser(req.body)
    res.json(result)
    }) 
    app.post ('/querywallet',async(req, res) =>{
    var result = await new request().querywallet(req.body)
    res.json(result)
    }) 

}
