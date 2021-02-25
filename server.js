"use strict";

// ============= Packages =========
const express = require("express");
const cors = require("cors"); // just works and we need it
const superagent = require("superagent"); // TO-DO:
const pg = require("pg");
require("dotenv").config();

// ============= App ==============
const app = express(); //express() returns a fully ready to run server object
app.use(cors()); // enables local procresses to talk to the server
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

//============== PORT =============
const PORT =  process.env.PORT || 3009;

// app.listen(PORT, () => console.log(`up on PORT ${PORT}`));

// console.log (process.env.server)
//This is where you access your stored API key

// const YELP_API_KEY = process.env.RESTAURANT_API_KEY // TO-DO
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const LOCATIONS_KEY = process.env.LOCATIONS_API_KEY;
const PARKS_KEY = process.env.PARKS_API_KEY;

// ============= Routes ==============


// ===== APP.get =====
app.get("/location", GetLocation);
app.get("/weather", GetWeather);
app.get("/parks", GetParks);


// ===== FUNCTIONS =====

// ===== LOCATION =====
function GetLocation(req, res) {
  console.log(req.query);
  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONS_KEY}&q=${req.query.city}&format=json`;
  superagent.get(url).then (infoBack => {
    console.log(infoBack);
    let locationOne = new Location (infoBack.body, req.query.city);
    res.send(locationOne);
  })
    .catch(error => {
      console.log(error);
    });
}

function Location(fileData, cityName) {
  this.search_query = cityName;
  this.formatted_query = fileData[0].display_name;
  this.latitude = fileData[0].lat;
  this.longitude = fileData[0].lon;
}
// LOCATION GTG

// ===== GET PARKS =====
function GetParks(req, res) {
  const url = `https://developer.nps.gov/api/v1/parks?q=${req.query.search_query}&api_key=${PARKS_KEY}`;
  superagent.get(url)
    .then((result) => {//Then we get the results of the URL
      // console.log(result.body);
      const parks = result.body.data.map((singlePark) => new ParkList(singlePark));
      res.send(parks);
    });
}
// ===== PARK LISTS =====
function ParkList(parkData){
  this.name = parkData.fullName;
  this.address = `${parkData.addresses[0].line1} ${parkData.addresses[0].city} ${parkData.addresses[0].stateCode} ${parkData.addresses[0].postalCode}`;
  this.fee = parkData.entranceFees[0].cost;
  this.description = parkData.description;
  this.url = parkData.url;
}
// ===== PARK CONS FUNC =====
// function ParkList(name, address, fee, description, url){
//   this.name = name;
//   this.address = address;
//   this.fee = fee;
//   this.description = description;
//   this.url = url;
// }

// ===== WEATHER =====
function GetWeather(req, res) {
  console.log(req.query);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=${req.query.longitude}&lon=${req.query.longitude}${WEATHER_KEY}`;
  
  const fileData = require("./data/weather.json"); // Is this needed? 
  
  function weatherOutput(day) {
    return new Weather(day);
  }
  function Weather(data) {
    this.forecast = data.weather.description;
    this.time = data.valid_date;
  }
  const weatherData = fileData.data.map(weatherOutput);
  res.send(weatherData);
}

// ============= Init Server ==============
client.connect()
  .then(()=>{
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  });
