const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/nexbiz_db';
console.log('Connecting to ' + uri);
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
