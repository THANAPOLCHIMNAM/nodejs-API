class parseAttrs {
    createUser(args){
        let array = [
            args.name.toString().toLowerCase(),
            args.stdID.toString(),
            args.tel.toString()
        ]
        return array
    }

    createwallet(args){
        let array = [
            args.walletName.toString(),
            args.money.toString(),
            args.owner.toString()
        ]
        return array
    }

    
}
module.exports = parseAttrs