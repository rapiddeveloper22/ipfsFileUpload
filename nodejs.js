const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const ipfs = ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' });
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/upload', async (req, res) => {
    const file = req.files.file;
    const fileName = req.body.fileName;
    const filePath = 'files/' + fileName;

    file.mv(filePath, async (err) => {
        if (err) {
            console.log('Error: Downloading file');
            return res.status(500).send(err);
        }

        const fileHash = await addFile(fileName, filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        })

        res.render('upload', { fileName, fileHash });
    })

});

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file });
    const fileHash = fileAdded.cid

    return fileHash;
}

app.listen(process.env.PORT || 3000, (server_port) => {
    console.log('Server is listening on port %d', server_port);
});