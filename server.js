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
var pieces = Array(15).fill().map(() => Array(30).fill(0));
var turn = 0;

let ball = { 
  speed: 0, 
  x: 100, 
  y: 100, 
  direction: 'down'
} 

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players.push(socket.id);
    io.sockets.emit('state', pieces, ball);
    ball.speed = 0.1;
    // io.sockets.emit('message', pieces);
  });
  socket.on('clickRequest', function(x, y) {
    // io.sockets.emit('message', 'click at ' + x + ', ' + y);
    // pieces[1][1] = 2;
    if (turn == 0 && socket.id == players[0] && fill_square(x, y, 1)) {
      // io.sockets.emit('message', 'turn 0 and player 0, placing piece');
      // pieces.push([x, y]);
      turn = 1;
      io.sockets.emit('state', pieces, ball);
    } else if (turn == 1 && socket.id == players[1] && fill_square(x, y, 1)) {
      // io.sockets.emit('message', 'turn 1 and player 1, placing piece');
      // pieces.push([x, y]);
      turn = 0;
      io.sockets.emit('state', pieces, ball);
    }
  })
});

function fill_square(x, y, piece) {
  square_row = Math.trunc((y - 13) / 40);
  square_column = Math.trunc((x - 13) / 40);
  // io.sockets.emit('message', 'row is ' + square_row + ' and column is ' + square_column);
  if (pieces[square_row][square_column] == 0) {
    pieces[square_row][square_column] = piece;
    // io.sockets.emit('message', pieces, ball);
    return true;
  } else {
    return false;
  }
}

var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
  // code ...
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;

  square_row = Math.trunc((ball.y) / 40);
  square_column = Math.trunc((ball.x) / 40);

  if (pieces[square_row][square_column] == 1) {
    if (ball.direction == 'left') {
      ball.direction = 'right';
    } else if (ball.direction == 'right') {
      ball.direction = 'left';
    } else if (ball.direction == 'up') {
      ball.direction = 'down';
    } else if (ball.direction == 'down') {
      ball.direction = 'up';
    }
  }
  
  if (ball.direction == 'left') {
    ball.x -= ball.speed * timeDifference;
  } else if (ball.direction == 'right') {
    ball.x += ball.speed * timeDifference;
  } else if (ball.direction == 'up') {
    ball.y -= ball.speed * timeDifference;
  } else if (ball.direction == 'down') {
    ball.y += ball.speed * timeDifference;
  }

  lastUpdateTime = currentTime;
  io.sockets.emit('state', pieces, ball);
}, 1000 / 60);