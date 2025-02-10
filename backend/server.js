const express = require('express');
const cors = require('cors');
const fs = require('fs')
const path = require('path')
require('dotenv').config();
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.get('/api/timeseries',(req,res) => {
    const data = fs.readFileSync(path.join(__dirname,"timeseries.json"));
    res.json(JSON.parse(data));
})

app.listen(PORT,() => {
    console.log('Listening on port 5000!')
})

