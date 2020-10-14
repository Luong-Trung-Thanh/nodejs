'use strict';

//const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const server = express();
server.use(bodyParser.json());
const axios = require('axios');
const {
  dialogflow,
  Suggestions,
  Permission, 
  SimpleResponse
} = require('actions-on-google');
const NodeGeocoder = require("node-geocoder");
const app = dialogflow({debug: true});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask('Please repeat');
});

app.intent("Default Welcome Intent", conv => {
  conv.data.requestedPermission = "DEVICE_PRECISE_LOCATION";
  conv.ask(new SimpleResponse('Welcome to location tracker'));
  return conv.ask(
    new Permission({
      context: "to locate you",
      permissions: conv.data.requestedPermission
    })
  );
});

app.intent("get_current_location", (conv, params, permissionGranted) => {
  if (permissionGranted) {
    const { requestedPermission } = conv.data;
    //let address;
    if (requestedPermission === "DEVICE_PRECISE_LOCATION") {
      const { coordinates } = conv.device.location;
      console.log('coordinates are', coordinates);

      //if (coordinates && address) {
      if (coordinates) {

var url = "https://nominatim.openstreetmap.org/reverse?lat="+coordinates.latitude+"&lon="+coordinates.longitude+"&format=json";

// request(url,function(error,response,body){
//     console.log(body);
//     return conv.close(new SimpleResponse(`Your Location details ${coordinates.latitude}, ${coordinates.longitude}, ${url}`));
// });


     return conv.close(new SimpleResponse(`Your Location details ${coordinates.latitude}, ${coordinates.longitude}, ${url}`));

      } else {
        // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
        // and a geocoded address on voice-activated speakers.
        // Coarse location only works on voice-activated speakers.

        return conv.close("Sorry, I could not figure out where you are.");
      }
    }
  } else {
    return conv.close("Sorry, permission denied.");
  }
});

// app.intent('Default Welcome Intent', (conv) => {
//     conv.ask('Hi, what do you wanna talk about?');
//     conv.ask(new Suggestions(['fashion tips', 'celebrity news']));
// });

// handlers for other intents..


server.post('/hook', app);


// server.get("/url", function(req, res) {

//   request('http://www.google.com', function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
//   });

// });


 





 server.get("/url", function(req, res) {
   console.log("vo day la gui request duoc roi ne");
  const listUsers = async () => {
    try {
        const res = await axios.get('https://nominatim.openstreetmap.org/reverse?lat=10.8636309&lon=106.7823465&format=json');
        console.log(res.data.display_name);
    } catch (err) {
        console.error("Loi "+ err);
    }
};

listUsers();
 });

 



server.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});