// Require Libraries
const express = require('express');
const http = require('http');
require('dotenv').config();

// App Setup
const app = express();
app.use(express.static('public'));

// Middleware
const exphbs  = require('express-handlebars');

const Tenor = require("tenorjs").client({
  // Replace with your own key
    "Key": process.env.API_KEY, // https://tenor.com/developer/keyregistration
    "Filter": "high", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
});

const TenorKey = process.env.API_KEY;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routes
app.get('/', (req, res) => {
    term = ""
    if (req.query.term) {
        term = req.query.term
    }
    const limit = 10;
    const options = new URL(`http://api.tenor.com/v1/search?q=${term}&key=${TenorKey}&limit=${limit}`);
    let tenorRequest = http.get(options, result => {
        body = '';
        result.on('data', chunk => {
            body += chunk
        });
        result.on('end', () => {
            const gifs = JSON.parse(body).results
            res.render('home', { gifs });
        });
    });
    tenorRequest.on("error", console.error);
})

app.get('/', (req, res) => {
    const gifUrl = 'https://media1.tenor.com/images/561c988433b8d71d378c9ccb4b719b6c/tenor.gif?itemid=10058245'
    res.render('hello-gif', { gifUrl })
})

app.get('/greetings/:name', (req, res) => {
    const name = req.params.name;
    res.render('greetings', { name });
})
// Start Server

app.listen(3000, () => {
    console.log('Gif Search listening on port localhost:3000!');
});
