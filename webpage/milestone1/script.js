const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

// set up the storage for the uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// set up the upload middleware using multer
const upload = multer({ storage: storage });

// handle the POST request to /upload
app.post('/upload', upload.single('imageUpload'), function(req, res, next) {
  // req.file contains information about the uploaded file
  if (!req.file) {
    res.status(400).send('No file uploaded');
  } else {
    res.status(200).send(req.file.filename);
  }
});

// start the server
app.listen(3000, function() {
  console.log('Server started on port 3000');
});
