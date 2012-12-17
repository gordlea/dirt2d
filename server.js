var http = require('http');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
var path = require('path');




// define port
// make html, js & css files accessible
app.use(express.static('public'));


    var port = process.env.PORT || 8080;
    server.listen(port);

    console.log('Your server goes on localhost:' + port);
