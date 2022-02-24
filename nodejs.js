const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

const ipfs = ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });
const app = express();
const pinata = pinataSDK('df7bf7e4d65592982531', 'ccc347d16afbf1fbf1a424af537d4b0152687e040d8ded3bbeff800087839765');

const options = {
    pinataMetadata: {
        name: 'My Awesome Website',
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())

app.get('/', (req, res) => {
    res.render('home');
});

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

app.post('/upload', async (req, res) => {
    const file = req.files.file;
    const filePath = 'files/' + file.name;
    let fullPath = req.body.path;
    fullPath = fullPath + '/' + file.name;
    console.log(fullPath);

    file.mv(filePath, async (err) => {
        if (err) {
            console.log('Error: Downloading file');
            return res.status(500).send(err);
        }

        pinata.pinFromFS(fullPath, options).then((result) => {
            fs.unlink(filePath, (err) => {
                if (err) console.log(err);
            })
            fileName = file.name;
            fileHash = result.IpfsHash;
            console.log(result);
            res.render('upload', { fileName, fileHash });
        }).catch((err) => {
            //handle error here
            console.log(err);
        });

    })

});


const hostt = '0.0.0.0';
const portt = process.env.PORT || 3000;

app.listen(portt, hostt, function () {
    console.log("Server started.......");
});