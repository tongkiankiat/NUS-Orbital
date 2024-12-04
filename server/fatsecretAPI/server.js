const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const clientID = process.env.CLIENT_ID || '555862211cf4418197cbe3afef10a4f0';
const clientSecret = process.env.CLIENT_SECRET || '8bc1bc3a25b84b49b5f6e9ec9d804ac4';
const fixieURL = process.env.FIXIE_URL;
let accessToken = '';
let tokenExpiresAt = 0;

const app = express();
const PORT = process.env.PORT || 80;

app.use(bodyParser.json());

// Get Access Token
function getAccessToken(callback) {
  const options = {
    method: 'POST',
    url: 'https://oauth.fatsecret.com/connect/token',
    auth: {
      user: clientID,
      password: clientSecret
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: {
      'grant_type': 'client_credentials',
      'scope': 'premier'
    },
    json: true,
    proxy: fixieURL
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error('Error getting access token: ', error);
      callback(error);
    } else {
      if (response.statusCode === 200) {
        accessToken = body.access_token;
        tokenExpiresAt = Date.now() + body.expires_in * 1000;
        console.log('Access Token obtained!');
        callback(null, accessToken);
      } else {
        console.error('Failed to obtain access token: ', body);
        callback(new Error('Failed to obtain access token'));
      }
    }
  });
}

// Query by searching for food name
function sendRequest(req, res, token, item) {
  const options = {
    method: 'POST',
    url: 'https://platform.fatsecret.com/rest/server.api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    qs: {
      method: 'foods.search.v3',
      search_expression: item,
      include_food_attributes: true,
      format: 'json'
      // max_results: 1
    },
    json: true,
    proxy: fixieURL
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error('Error obtaining information: ', error);
      res.status(500).send('Error obtaining information');
    } else {
      if (response.statusCode === 200) {
        console.log('Data obtained!');
        res.status(response.statusCode).json(body);
      } else {
        console.error('Failed to fetch data: ', body);
        res.status(response.statusCode).send('Failed to fetch data');
      }
    }
  });
}

// Post request for search by food name
app.post('/api/proxy', (req, res) => {
  const item = req.body.item;
  if (!item) {
    return res.status(400).send('Search item is required');
  }

  if (!accessToken || Date.now() >= tokenExpiresAt) {
    getAccessToken((error, token) => {
      if (error) {
        return res.status(500).send('Error getting access token');
      } else {
        sendRequest(req, res, token, item);
      }
    });
  } else {
    sendRequest(req, res, accessToken, item);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
