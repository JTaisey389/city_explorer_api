'use strict'

let newArray = arr.map(calback(currentValue[, index[, array]]){
  //return element for newArray, after exectuting something
})

// array.map returns a new array
// .map's purpose is to create new arrays from the array it is called from

// The array is made up of whatever is returned by the callback, each time it is called.

// EAXMPLE //
const letters =['a', 'b', 'c'];
 
letters.map((value, index, array) => {
  return 2;
})

const output Array = [];

// USE THIS FOR LAB
function Dog (name, age) {
  this.name = name;
  this.age = age;
}
const doggies = ['ginger', 'molly', 'ratcat', 'rufus'];

doggies.map(makeSomeFloofs);
function makeSomeFloofs(value, index){
  return new Dog(value, index);
}

// EXAMPLE 2
function Friend(name){
  this.name = name;
}
const friends = [];
doggies.forEach(dog => friends.push(new Friend(dog)));
console.log(friends);

// USE .MAP 
// This simplified line 38 
doggies.map(dog => new Friend(dog));

// Example 2
const nums = [1,2,3,4,5,6,7,8,9,10];

nums.map(numStuff);
function numStuff(valuePotato, idx, arr) {
  return 1 + idx * valuePotato;
}

// WRRC 
/* 1. We visit the local host 300 at the location of the city
2. Response: Search Query of seattle 
3. Expresses job is to send and receiver responses from the server

//  Today we are going out to location IQ
// We are going to request information from Zomato
// API Application Program Interface 

// .catch(errorThatComesBack)

200 things went well
300 redirect
400 you did something wrong
500 I did something wrong 
