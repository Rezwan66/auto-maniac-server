const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// local
app.get('/', (req, res) => {
    res.send('Auto-Maniac server is running! 🚗🚗🚗');
})

app.listen(port, () => {
    console.log(`Auto-Maniac server running at port: ${port}`);
})