'use strict'

// ============= Packages =========
const express = require('express');
const cors = require('cors'); // just works and we need it 

require('dotenv').config();

// ============= App ==============

const app = express(); //express() returns a fully ready to run server object
app.use(cors()); // enables local procresses to talk to the server 

const PORT = process.env.PORT // ASK TO SEE IF THIS IS SET UP RIGHT
// console.log (process.env.server)
//This is where you access your stored API key

const WEATHER_API_KEY = process.env.WEATHER_API_KEY; 
const LOCATIONS_API_KEY = process.env.LOCATIONS_API_KEY
// const YELP_API_KEY = process.env.RESTAURANT_API_KEY
// const PARKS_API_KEY = process.env.RESTAURANT_API_KEY

// ============= Routes ==============

// LOCATION 1.0
app.get('/location', handleGetLocation);
function handleGetLocation(req, res){
  // TODO: go to the internet and data
  // we need a superagent: npm install -S superagent
  // const URL = https:// key= the passkey and only your passkey
  // superagent.get(url).then(stuffThatComesBack =>)
  // CREATE A GLOBAL VARIABLE FOR YOUR API KEY AND REVISE THE CONST URL TO TEMPLATE LITERALS
  // STORE THE PASSKEY INTO MY ENV 
  console.log(req.query);
  const dataFromTheFile = require('./data/location.json');
  const output = new Location(dataFromTheFile, req.query.city);
  res.send(output);

}
// LOCATION 1.1
function Location (dataFromTheFile, cityName){
  this.search_query = cityName;
  this.formatted_query = dataFromTheFile[0].display_name;
  this.latitude = dataFromTheFile[0].lat;
  this.longitude =dataFromTheFile[0].lon;
}


// WEATHER 1.0
app.get('/weather', handleGetWeather);

// Inside the for loop is where we will call the weather constructor based off of (i)
// When we call that thing we want to push that to the output which is an empty array
// Outside of the loop, finish the request response cycle
// Now we do a response.send for the array of objects that we created
// clean up the weather constructor. TAKE A LOOK AT TRELLO, it is looking for two
// Everything on the left hand side need to have the information from the TRELLO BOARD. It needs to be the exact charecter

function handleGetWeather(req, res){
  console.log(req.query);

  const dataFromTheFile = require('./data/weather.json');
  // forEach(dataFromTheFile.data[i]);
  function weatherOutput(day){
    // console.log(weatherOutput);
    return new Weather(day);
  }
  function Weather(data){
    this.forecast = data.weather.description;
    this.time = data.valid_date;
  }
  const weatherData = dataFromTheFile.data.map(weatherOutput);
  // console.log(weatherData);
  res.send(weatherData);
}

// const require = data.map([]) => {
// for (let i = 0; i < dataFromTheFile.data.length; i++) 
//   handleGetWeather
//   console.log(dataFromTheFile.data[i]);
//   output.push(new Weather(dataFromTheFile.data[i]));


// ============= Init Server ==============
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})
;
// Push//
