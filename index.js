'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const request = require('request');
server.use(bodyParser.json());
const {
  dialogflow,
  Suggestions,
  Permission, 
  SimpleResponse
} = require('actions-on-google');
const NodeGeocoder = require("node-geocoder");
const app = dialogflow({debug: true});

// app.intent('Default Fallback Intent', (conv) => {
//     conv.ask('Please repeat');
// });

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

request(url, function (err, res, body) {
    //nếu có lỗi
    if (err)
        throw err;
    //in ra header
    console.log(res);
    //in ra body nhận được
    console.log(body);
    conv.ask(new SimpleResponse(body));
})


       

      return conv.close(new SimpleResponse(`Your Location details ${coordinates.latitude}, ${coordinates.longitude}`));
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
server.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});