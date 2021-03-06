const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const fleekStorage = require('@fleekhq/fleek-storage-js')
const pinataSDK = require('@pinata/sdk');

const ipfs = ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });
const app = express();
const pinata = pinataSDK('df7bf7e4d65592982531', 'ccc347d16afbf1fbf1a424af537d4b0152687e040d8ded3bbeff800087839765');

// const options = {
//     pinataMetadata: {
//         name: 'My Awesome Website',
//         keyvalues: {
//             customKey: 'customValue',
//             customKey2: 'customValue2'
//         }
//     },
//     pinataOptions: {
//         cidVersion: 0
//     }
// };

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())

app.get('/', (req, res) => {
    res.render('index');
});

// pinata.testAuthentication().then((result) => {
//     //handle successful authentication here
//     console.log(result);
// }).catch((err) => {
//     //handle error here
//     console.log(err);
// });

app.post('/upload', async (req, res) => {
    const file = req.files.file;
    // let fullPath = req.body.path;
    // fullPath = fullPath + '/' + file.name;
    // const readableStreamForFile = fs.createReadStream(fullPath);
    let fullPath = req.body.path;
    fullPath = fullPath + "\\" + file.name;
    console.log(fullPath);
    let filePath = 'files/' + file.name;

    file.mv(filePath, async (err) => {
        if (err) {
            console.log("Error while downloading");
            return res.status(500).send(err);
        }
        fs.readFile(filePath, async (error, fileData) => {
            const uploadedFile = await fleekStorage.upload({
                apiKey: 'ML41Qz4GTgN0avpiJ0whww==',
                apiSecret: 'lXSFV61xUALbLpKRFZN2dVRnYJiA15i0HUQ8GYXuA6M=',
                key: file.name,
                ContentType: 'pdf/jpg/png/jpeg/docx/doc/mp4/mp3/hvec',
                data: fileData,
                httpUploadProgressCallback: (event) => {
                    console.log(Math.round(event.loaded / event.total * 100) + '% done');
                }
            });
            fileName = file.name;
            fileHash = uploadedFile.hashV0;
            console.log(uploadedFile);

            res.render('upload', { fileName, fileHash });
        })
    });

    // pinata.pinFromFS(fullPath, options).then((result) => {
    //     fileName = file.name;
    //     fileHash = result.IpfsHash;
    //     console.log(result);
    //     res.render('upload', { fileName, fileHash });
    // }).catch((err) => {
    //     console.log(err);
    // });




    // pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
    //     //handle results here
    //     console.log(result);
    // }).catch((err) => {
    //     //handle error here
    //     console.log(err);
    // });
});


const hostt = '0.0.0.0';
const portt = process.env.PORT || 3000;

app.listen(portt, hostt, function () {
    console.log("Server started.......");
});