'use strict';

var post = process.env.PORT || 8000; // Better flexiblity than hardcoding the port

var Http = require('http');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var SwaggerUi = require('swaggerize-ui')  // Provides UI for testing the API
var Path = require('path');

var App = Express();

var Server = Http.createServer(App);

// Enable cross origin resource sharing (for app frontend)
App.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    res.header('Access-Control-Allow-Header', 'Content-Type,Authorization,Content-Length,X-Requested-With');
    
    // Prevents CORS preflight request (for PUT game_guess) from redirecting
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next(); // Passes control to the next (Swagger) handler
    }
});

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.json'),
    handlers: Path.resolve('./handlers'),
    docspath: '/swagger'  // Hooks up the testing UI
}));

App.use('/', SwaggerUi({  // Serves the testing UI from our base URL
    docs: '/swagger'
}));

Server.listen(port, function () {
    App.swagger.api.host = this.address().address + ':' + this.address().port;
    /* eslint-disable no-console */
    console.log('App running on %s:%d', this.address().address, this.address().port);
    /* eslint-disable no-console */
});
