const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');

// Serve static files from public directory
app.use(express.static('public'));

// Use body parser for parsing json
app.use(bodyParser.urlencoded({extended: true}));

// Serve the html index file I created
app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/index.html')
})


// Serve the Guestbook, which is comprised of a separate header and footer HTML files that sandwich the JSON in a table.
app.get('/guestbook', (req, res) => {
    let messages = require('./public/guestbook.json')
    let header = fs.readFileSync('./public/guestbookheader.html')
    let footer = fs.readFileSync('./public/guestbookfooter.html')

    let results = '';

    // Loop through messages and add them to results variable readily formatted to add to HTML table
    for (message of messages) {
        results +=
        '<tr class="table-light">' +
        '<td>'+message.username+'</td>'+
        '<td>'+message.country+'</td>'+
        '<td>'+message.message+'</td>'+
        '<td>'+message.date+'</td>'+
        '<tr>'
    }
    // Sandwich the results variable between the header and footer HTML files and serve it
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

// Serve the html form from static file
app.get('/newmessage', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/guestbookform.html')
})

// Post new message to JSON file and redirect to guestbook
app.post('/newmessage', (req, res) => {
    const messages = require('./public/guestbook.json');

    const date = new Date();
    // When running on my local server the 'toLocaleDateString()' function returns the date
    // in the correct, European format dd/mm/yy but on Render (where the project is deployed)
    // it returns the date in the US format mm/dd/yy, which I do not want. The location in Render
    // is set to Europe so that shouldn't happen
    // therefore I have changed the 'toLocaleDateString()' function to display the date in the UK format
    
    messages.push({
        "username": req.body.username,
        "country": req.body.country,
        "message": req.body.message,
        "date": date.toLocaleDateString("en-GB")
    });

    let jsonStr = JSON.stringify(messages);

    fs.writeFile('./public/guestbook.json', jsonStr, (err) => {
        if (err) throw err;
        console.log('success!')
    })

    res.redirect('/guestbook')
})

// Serve ajax message HTML form, which is again two separate folders (header and footer)
app.get('/ajaxmessage', (req, res) => {
    let header = fs.readFileSync('./public/ajaxformheader.html')
    let footer = fs.readFileSync('./public/ajaxformfooter.html')

    fs.writeFile('./public/ajaxform.html', `${header}`, (err) => {
        if (err) throw err;
            fs.appendFile('./public/ajaxform.html', `${footer}`, (err) => {
                if (err) throw err;
                console.log('success!')
                res.status(200).sendFile(__dirname + '/public/ajaxform.html');
            })
    })
})

// To display the ajax message under the form I used a header and footer html file and used file style to stack them as one file and then serve the file using Express
app.post('/ajaxmessage', (req, res) => {    
    let header = fs.readFileSync('./public/ajaxformheader.html')
    let footer = fs.readFileSync('./public/ajaxformfooter.html')

    let username = req.body.username;
    let country = req.body.country;
    let message = req.body.message;

    let ajaxMessage = `<h3>${username} from ${country} says ${message}!</h3>`

    fs.writeFile('./public/ajaxform.html', `${header}`, (err) => {
        if (err) throw err;
        fs.appendFile('./public/ajaxform.html', `${ajaxMessage}`, (err) => {
            if (err) throw err;
            fs.appendFile('./public/ajaxform.html', `${footer}`, (err) => {
                if (err) throw err;
                res.status(200).sendFile(__dirname + '/public/ajaxform.html');
            })
        })
    })
})

// I added a 404 error page just incase someone got lost
app.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + ('/public/404error.html'))
})

// Express server
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})