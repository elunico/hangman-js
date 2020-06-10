/* eslint-env node */
/* eslint-disable no-process-env, no-console */

const express = require('express');
const fetch = require('node-fetch');
const logging = require('./logging');

const app = express();

require('dotenv').config();

const reqURL = 'https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun%2Cadjective%2Cverb%2Cadverb%2Cinterjection&minCorpusCount=15&maxCorpusCount=-1&minDictionaryCount=15&maxDictionaryCount=-1&minLength=4&maxLength=9&limit=20&api_key=' + process.env.API_KEY;

app.use(logging('lots'));

app.use(express.static('client'));

app.get('/random-word', (req, res) => {
  fetch(reqURL).then(response => response.json()).then(data => res.json(data));
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on ${process.env.PORT || 8000}`);
});
