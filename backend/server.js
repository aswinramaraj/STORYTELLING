const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/Mongo');
const Generateroute = require('./Routes/Generateroute');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connectDB(); // ✅ Uncomment if using DB
app.use('/api', Generateroute);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
