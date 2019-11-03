// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(process.env.PORT || 5000, function() {
  console.log('Starting server on port 5000');
});

var players = [];
var pieces = [];
var turn = 0;

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players.push(socket.id);
  });
  socket.on('clickRequest', function(x, y) {
    io.sockets.emit('message', 'click at ' + x + ', ' + y);
    if (turn == 0 && socket.id == players[0]) {
      io.sockets.emit('message', 'turn 0 and player 0, placing piece');
      pieces.push([x, y]);
      turn = 1;
    } else if (turn == 1 && socket.id == players[1]) {
      io.sockets.emit('message', 'turn 1 and player 1, placing piece');
      pieces.push([x, y]);
      turn = 0;
    }
    
  })
});

setInterval(function() {
  io.sockets.emit('state', pieces);
}, 1000 / 60);