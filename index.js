'use strict';

const {
  dialogflow,
  Suggestions
} = require('actions-on-google');
const app = dialogflow({debug: true});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask('Please repeat');
});

app.intent('Default Welcome Intent', (conv) => {
    conv.ask('Hi, what do you wanna talk about?');
    conv.ask(new Suggestions(['fashion tips', 'celebrity news']));
});

// handlers for other intents..

const express = require('express');
const bodyParser = require('body-parser');
const server = express();
server.use(bodyParser.json());
server.post('/hook', app);
server.listen(3000, () => console.log('Server listening on port 3000.'))