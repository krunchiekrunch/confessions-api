# Confessions API

An API for sending, reading, and rating anonymous confessions written in JavaScript 

## Setup
```
git clone https://github.com/RadioactivePotato/confessions-api
cd confessions-api
npm install express body-parser
node api.js
```

You can change the port on line 6 of `api.js`

## Endpoints

GET:
```
/help
/getConfession
/ratings?id=<confessionID>
```

POST:
```
/postRatings
/postConfession
```

## Example commands

### GET Help
```
curl http://localhost:45891/help
```
### GET Confession
```
curl http://localhost:45891/getConfession
```
### GET Ratings
```
curl http://localhost:45891/ratings?id=<confessionID>
```
### POST Confession
```
curl -X POST http://localhost:45891/postConfession -H "Content-Type: application/json" -d "{\"text\": \"I'm still stuck in vim\"}"
```
### POST Ratings
```
curl -X POST http://localhost:45891/postRatings -H "Content-Type: application/json" -d "{\"id\": 1, \"rating\": 5}"
```

<hr>

<details>
  <summary>Try the API!</summary>

### GET Help
```
curl https://confessions.krunch.hackclub.app/help
```
### GET Confession
```
curl https://confessions.krunch.hackclub.app/getConfession
```
### GET Ratings
```
curl https://confessions.krunch.hackclub.app/ratings?id=<confessionID>
```
### POST Confession
```
curl -X POST https://confessions.krunch.hackclub.app/postConfession -H "Content-Type: application/json" -d "{\"text\": \"I'm still stuck in vim\"}"
```
### POST Ratings
```
curl -X POST https://confessions.krunch.hackclub.app/postRatings -H "Content-Type: application/json" -d "{\"id\": 1, \"rating\": 5}"
```

</details>