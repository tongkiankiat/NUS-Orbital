const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const clientID = process.env.CLIENT_ID || 'b96aaf23502141c49a0654b263f9a628';
const clientSecret = process.env.CLIENT_SECRET || '8a6d21bb3e864b508d9167bb4d1d3b93';
let accessToken = '';
let tokenExpiresAt = 0;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Function to get access token
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
            'scope': 'basic'
        },
        json: true,
        proxy: process.env.FIXIE_URL
    };

    request(options, function (error, response, body) {
        if (error) {
            console.error("Error getting access token: ", error);
            callback(error);
        } else {
            accessToken = body.access_token;
            tokenExpiresAt = Date.now() + body.expires_in * 1000;
            console.log("Access Token obtained!");
            callback(null, accessToken);
        }
    });
}

// Function to send request to FatSecret API
function sendRequest(req, res, token, item) {
    const options = {
        method: 'POST',
        url: 'https://platform.fatsecret.com/rest/server.api',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        qs: {
            method: 'foods.search',
            search_expression: item
        },
        json: true,
        proxy: process.env.FIXIE_URL
    };

    request(options, function (error, response, body) {
        if (error) {
            console.error("Error obtaining information: ", error);
            res.status(500).send('Error obtaining information');
        } else {
            console.log("Data obtained!");
            res.status(response.statusCode).json(body);
        }
    });
}

// Proxy Endpoint
app.post('/api/proxy', (req, res) => {
    const item = req.body.item;
    if (!item) {
        return res.status(400).send('Search item is required');
    }

    if (!accessToken || Date.now() >= tokenExpiresAt) {
        // Get access token if it has not been done so or if it has expired
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
