'use strict';
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway,X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const util = require('util')
const ccpPath = path.resolve(__dirname, '..', 'blockchain', 'config' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const CONFIG_CHANNEL_NAME = "mychannel"
const CONFIG_CHAINCODENAME = "mychaincode"

const walletPath = path.join(process.cwd(), './blockchain/config/wallet');
console.log(`Wallet path: ${walletPath}`);
const wallet = new FileSystemWallet(walletPath);

class service {

    async INIT() {


        let functionName = `[blockchain.service.INIT()]`
        try {
    
            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['ca1.example.com'].url;
            const ca = new FabricCAServices(caURL);
    
            // // Create a new file system based wallet for managing identities.
            // const walletPath = path.join(process.cwd(), 'wallet');
            // const wallet = new FileSystemWallet(walletPath);
            // console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (!adminExists) {
                // console.log('An identity for the admin user "admin" already exists in the wallet');
                // return;
            const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import('admin', identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
            }
    
            console.log(`${functionName} we ready`)
            return;
    
        } 
        catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            process.exit(1);
        }
    }

    async register(user) {
        let functionName = `[blockchain.service.INIT()]`

        try {
    
            const userExists = await wallet.exists(user);
            if (userExists) {
                console.log('An identity for the user "user1" already exists in the wallet');
                return;
            }
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists('admin');
            if (adminExists) {

            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });
    
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
    
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: user, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(user, userIdentity);
            console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
          
            }
            console.log(`${functionName} we ready to register`)
            return(`${functionName} we ready to register`)
           
        } catch (error) {
            console.error(`Failed to register user "user1": ${error}`);
            process.exit(1);
        }
    }

    async invoke(user,functionName,args) {
        
    try {

        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
        const contract = network.getContract(CONFIG_CHAINCODENAME);


        // Get the contract from the network.

        const argsString = args.map((arg) => util.format('%s', arg)).join('|');
        await contract.submitTransaction(functionName, argsString);
        // const contract = network.getContract(CONFIG_CHAINCODENAME);
        // await contract.submitTransaction(functionName,args.Name,args.ID,args.Tel);
        // const argsString = args.map((arg) => util.format('%s', arg)).join('|');
        // await contract.submitTransaction(functionChaincode, argsString);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();
        return ("Transaction has been submitted-------" + argsString)

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        //process.exit(1);
        return `Failed to submit transaction: ${error}`
    }
}

    async queryuser(user,sidID) {
        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
    
            // Get the contract from the network.
            const contract = network.getContract(CONFIG_CHAINCODENAME);
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            var result1 = await contract.evaluateTransaction('query',sidID);
            console.log(`Transaction has been evaluated, result is: ${'name = ' + result1.toString()}`);

            return JSON.parse(result1.toString())
    
        } 
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        } 
    }
    async querywallet(user,walletID) {
        try {
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(user);
            if (!userExists) {
                console.log('An identity for the user "user1" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);
    
            // Get the contract from the network.
            const contract = network.getContract(CONFIG_CHAINCODENAME);
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            var result2 = await contract.evaluateTransaction('query',walletID);
            console.log(`Transaction has been evaluated, result is: ${'wallet = ' + result2.toString()}`);
            return JSON.parse(result2.toString())
    
        } 
        catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }
    async query(user,sidID,walletID) {
        try {
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CONFIG_CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(CONFIG_CHAINCODENAME);

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result1 = await contract.evaluateTransaction('query',sidID);
        console.log(`Transaction has been evaluated, result is: ${'name = ' + result1.toString()}`);
        var result2 = await contract.evaluateTransaction('query',walletID);
        console.log(`Transaction has been evaluated, result is: ${'wallet = ' + result2.toString()}`);

    } 
    catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
    
    
}
    }




module.exports = service