const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Home route: Renders a form to enter a name
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle form submission and API request
app.post('/get-joke', async (req, res) => {
    const { name } = req.body;

    try {
        // Make API request to JokeAPI
        const jokeResponse = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                type: 'single', 
                blacklistFlags: 'nsfw,racist,sexist',
            },
        });

        const joke = jokeResponse.data.joke;

        // Inject user's name into the joke
        const personalizedJoke = joke.replace(/Chuck Norris|You/, name);

        // Render the result page with the joke
        res.render('joke', { joke: personalizedJoke });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Failed to fetch a joke. Please try again!' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
