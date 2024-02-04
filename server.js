// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of cities.' });
    }

    const weatherPromises = cities.map(async (city) => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_OPENWEATHERMAP_API_KEY`);
        const temperature = response.data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
        return { [city]: `${temperature.toFixed(1)}C` };
      } catch (error) {
        return { [city]: 'Not available' };
      }
    });

    const weatherResults = await Promise.all(weatherPromises);
    const result = { weather: Object.assign({}, ...weatherResults) };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
