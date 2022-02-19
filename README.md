# door-api

An API for the ESP8266 based door controller

Build status: [![allhandsactive](https://circleci.com/gh/allhandsactive/door-api.svg?style=svg)](https://circleci.com/gh/allhandsactive/door-api)

## API Docs

### Auth

HTTP bearer tokens (via passport) are used for auth. We support a few methods of passing the token: https://github.com/jaredhanson/passport-http-bearer#making-authenticated-requests

All methods require auth

### GET /user

Returns a JSON formatted list of valid IDs:

```
["01020304", "05060708", "09101112", "13141516"]
```

### GET /time

Returns the number of milliseconds since January 1st 1970 UTC

```
1645314605512
```
