const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');

// Serve static files from public directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/index.html')
})

app.get('/guestbook', (req, res) => {
    let messages = require('./public/guestbook.json')
    let header = fs.readFileSync('./public/guestbookheader.html')
    let footer = fs.readFileSync('./public/guestbookfooter.html')

    let results = '';

    for (message of messages) {
        results +=
        '<tr>' +
        '<td>'+message.username+'</td>'+
        '<td>'+message.country+'</td>'+
        '<td>'+message.message+'</td>'+
        '<td>'+message.date+'</td>'+
        '<tr>'
    }

    fs.writeFile('./public/guestbook.html', `${header}`, (err) => {
        if (err) throw err;
        fs.appendFile('./public/guestbook.html', `${results}`, (err) => {
            if (err) throw err;
            fs.appendFile('./public/guestbook.html', `${footer}`, (err) => {
                if (err) throw err;
                console.log('success!')
                res.status(200).sendFile(__dirname + '/public/guestbook.html');
            })
        })
    })
})

app.get('/newmessage', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/guestbookform.html')
})

app.post('/newmessage', (req, res) => {
    const messages = require('./public/guestbook.json');

    const date = new Date();

    messages.push({
        "username": req.body.username,
        "country": req.body.country,
        "message": req.body.message,
        "date": date.toLocaleDateString()
    });

    let jsonStr = JSON.stringify(messages);

    fs.writeFile('./public/guestbook.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('success!')
    })

    res.redirect('/guestbook')
})

app.get('/ajaxmessage', (req, res) => {
    const messages = require('./public/guestbook.json');

    res.status(200).send(messages);
})
app.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + ('/public/404error.html'))
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})