const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');

// Serve static files from public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/index.html')
})

app.get('*', (req, res) => {
    res.status(404).send("Oops, that page doesn't exist")
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})