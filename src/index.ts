import express from 'express';
import bodyparser from 'body-parser';
import { config } from './configuration';
import fs from 'fs';
import { User } from './models/user-model';

let app = express();

//below middleware is written to allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyparser.json());

app.get('/id', (req, res) => {
    try{
    let userNumber = fs.readFileSync('./src/files/numberOfUsers.txt', 'utf-8');
    console.log(userNumber);
    if(userNumber){
        const updateValue = parseInt(userNumber) + 1;
        fs.writeFileSync('./src/files/numberOfUsers.txt',  updateValue.toString());
    }
    res.send(userNumber);
    } catch {
        res.status(500);
    }
    
});

app.post('/saveUser', (req, res) => {
    try {
        let user : User = {
            id : req.body.id,
            submit : req.body.submit,
            time: req.body.time,
            sentence: req.body.sentence
        }; 
        let data = JSON.stringify(user);
        fs.appendFileSync(`./src/files/${req.body.id}.json`, data);
        console.log(user);
        res.json(user);
    } catch {
        res.status(500);
    }
});

app.get('/user', (req, res) => {
    try {
        let data = fs.readFileSync(`./src/files/${req.query.id}.json`, 'utf-8');
        let user = JSON.parse(data);
        res.json(user);
    } catch {
        res.status(500);
    }
});

app.put('/updateUser', (req, res) => {
    try {
        let user : User = {
            id : req.body.id,
            submit : req.body.submit,
            time: req.body.time,
            sentence: req.body.sentence
        }; 
        let data = JSON.stringify(user);
        fs.writeFileSync(`./src/files/${req.body.id}.json`, data);
        console.log(user);
        res.json(user);
    } catch {
        res.status(500);
    }
});

app.delete('/deleteUser', (req, res) => {
    try {
        fs.unlinkSync(`./src/files/${req.query.id1}.json`);
        fs.unlinkSync(`./src/files/${req.query.id2}.json`);
        res.send(true);
    } catch {
        res.status(500);
    }
});

app.listen(config.expressRouterOptions.port, () =>
    console.log("Server running on port :" + config.expressRouterOptions.port)
);