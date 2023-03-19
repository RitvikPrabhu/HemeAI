const express = require('express');
const app = express();
app.use(express.static('public'));

// Define a route for the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  
  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });


  //http://localhost:3000/