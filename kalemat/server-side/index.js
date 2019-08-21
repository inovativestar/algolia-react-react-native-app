const express = require('express');
const app = express();
const format = require('util').format;
const firebase = require('firebase');
const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');
const projectId = "lyric-test-642ce";
const storage = googleStorage({
  projectId,
  keyFilename: './lyric-test-642ce-firebase-adminsdk-sv2hb-2cbde03df4.json'
});

const bucket = storage.bucket(`${projectId}.appspot.com`);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

app.set('views', './views') // specify the views directory
app.set('view engine', 'ejs') // register the template engine

app.listen(3000, () => {
  console.log('App listening to port 3000');
});

app.get('/', (req, res) => {
  res.render('index');
})

app.post('/upload', multer.single('file'), (req, res) => {
  console.log('Upload Image');

  let file = req.file;
  if (file) {
    uploadImageToStorage(file).then((url) => {
      res.status(200).send({
        status: 'success',
        url
      });
    }).catch((error) => {
      res.status(200).send({
        status: 'error',
        error
      });
      console.error(error);
    });
  }
});

const uploadImageToStorage = (file) => {
  let prom = new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    const mimetype = file.mimetype;
    let newFileName = `posters/${Date.now()}.${mimetype.split('/').slice(-1)}`;
    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype,
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      }).then(signedUrls => {
        const url = signedUrls[0];
        resolve(url);
      });
    });

    blobStream.end(file.buffer);
  });
  return prom;
}