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

// ============= API KEYS =========
const MOVIE_KEY = process.env.MOVIE_API_KEY;
const YELP_KEY = process.env.YELP_API_KEY;
const WEATHER_KEY = process.env.WEATHER_API_KEY;
const LOCATIONS_KEY = process.env.LOCATIONS_API_KEY;
const PARKS_KEY = process.env.PARKS_API_KEY;

// ============= Routes ==============
app.get("/location", GetLocation);
app.get("/weather", GetWeather);
app.get("/parks", GetParks);
app.get("/movies", GetMovies);
app.get("/yelp", GetYelp);

// ===== FUNCTIONS =====
function GetLocation(req, res) {
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

function GetParks(req, res) {
  const url = `https://developer.nps.gov/api/v1/parks?q=${req.query.search_query}&api_key=${PARKS_KEY}`;
  superagent.get(url)
    .then((output) => {//Then we get the results of the URL
      const parks = output.body.data.map((singlePark) => new Park(singlePark));
      res.send(parks);
    });
}

function Park(parkData){
  this.name = parkData.fullName;
  this.address = `${parkData.addresses[0].line1} ${parkData.addresses[0].city} ${parkData.addresses[0].stateCode} ${parkData.addresses[0].postalCode}`;
  this.fee = parkData.entranceFees[0].cost;
  this.description = parkData.description;
  this.url = parkData.url;
}

function GetWeather(req, res) {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.latitude}&lon=${req.query.longitude}&key=${WEATHER_KEY}`;
  superagent.get(url)
    .then((output) => {
      function weatherOutput(day) {
        return new Weather(day);
      }
      function Weather(data) {
        this.forecast = data.weather.description;
        this.time = data.valid_date;
      }
      // console.log(result.body);
      const weatherData = output.body.data.map(weatherOutput);
      res.send(weatherData);
    });
}

function GetYelp (req,res){
  const offset = (req.query.page -1) * 5;
  const url = `https://api.yelp.com/v3/businesses/search?term=restaurant&limit=5&latitude=${req.query.latitude}&longitude=${req.query.longitude}&offset=${offset}`;
  superagent.get(url).set('authorization', `bearer ${YELP_KEY}`).then((output) => {
    console.log(output.body);
    const yelp = output.body.businesses.map((singleYelp) => new Yelp(singleYelp));
    res.send(yelp);
  }).catch(error =>{console.error(error);});
}

function Yelp (object){
  this.name = object.name;
  this.image_url = object.image_url;
  this.price = object.price;
  this.raiting = object.raiting;
  this.url = object.url;
}

function GetMovies (req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_KEY}&language=en-US&query=${req.query.search_query}&page=1&include_adult=false`; 
  superagent.get(url)
    .then((output) => {
      // console.log(output.body);
      const movie = output.body.results.map((singleMovie) => new Movie(singleMovie));
      res.send(movie);
    }) .catch(error =>{console.error(error);});
}

function Movie (object){
  this.title = object.title;
  this.overview = object.overview;
  this.average_votes = object.average_votes;
  this.total_votes = object.total_votes;
  this.image_url = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${object.poster_path}` || 'sorry no image';
  this.popularity = object.popularity;
  this.released_on = (object.release_date);
}

// ============= Init Server ==============
client.connect()
  .then(()=>{
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  });
