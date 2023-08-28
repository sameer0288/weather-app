const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.post("/getWeather", async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

async function getWeatherData(cities) {
  const apiKey = "511bbba5de09e4ccc885a1dba0651210";
  const baseUrl = "http://api.weatherstack.com/current";

  const cityNames = cities.split(",");

  const weatherData = {};

  for (const city of cityNames) {
    const trimmedCity = city.trim();
    try {
      const response = await axios.get(baseUrl, {
        params: {
          access_key: apiKey,
          query: trimmedCity,
        },
      });

      console.log(`Response for ${trimmedCity}:`, response.data);

      if (response.data && response.data.current) {
        weatherData[trimmedCity] = response.data.current.temperature + "°C";
      } else {
        weatherData[trimmedCity] = "N/A";
      }
    } catch (error) {
      weatherData[trimmedCity] = "N/A";
    }
  }

  return weatherData;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
