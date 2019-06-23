const service = require ("../blockchain/service")
const parseAttrs = require("./parseAttrs")

// const FUNCregister = "register"
const FUNCUSER = "createUser"
const FUNCWALLET = "createwallet"
const FUNCQUERY = "query"


class request {
    async register(req){
        var result = await new service().register(req.user)
        console.log(result)
        return result    
    }


    async createUser(req){
        // let array = {
        //     Name : req.name,
        //     ID : req.stdID,
        //     Tel : req.tel
        // }
        // console.log(user)
        // var result = await new service().invoke("user1",FUNCUSER,user)
        // return result
        var user = req.user
        var result1 = new parseAttrs().createUser(req)
        console.log(result1)
        var result = await new service().invoke(user,FUNCUSER,result1)
        console.log(result)
        return result
    }

    async createwallet(req){
        // var user = {
        //     Name : req.walletname,
        //     ID : req.money,
        //     Tel : req.owner
        // }
        // console.log(user)
        // var result = await new service().invoke("user1",FUNCWALLET,user)
        // return result
        var user = req.user
        var result1 = await new parseAttrs().createwallet(req)
        console.log(result1)
        var result = new service().invoke(user,FUNCWALLET,result1)
        console.log(result)
        return result
    }
    async queryuser(req){

        var sidID = "stdID|" + req.stdID
        var user = req.user
        
            //walletname : req.walletname
            console.log(sidID)
            
        var result = await new service().queryuser(user,sidID)
        return result
    }
    async querywallet(req){

        var walletID = "wallet|" + req.walletname.toLowerCase()
        var user = req.user
            console.log(walletID)
        var result = await new service().querywallet(user,walletID)
        return result
    
    }

}
module.exports = request