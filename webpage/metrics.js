const express = require('express');
const { spawn } = require('child_process');

const app = express();

app.get('/metrics', function(req, res) {
  const childPython = spawn('python', ['metrics.py', '../../datasets/data/Testing/images/BloodImage_00391.jpg']);

  childPython.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    res.send(data);
  });

  childPython.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    res.send(data);
  });

  childPython.on('close', (code)=>{
    console.log(`child process exited with code ${code}`)
  });
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
