var socket = io();
socket.on('message', function(data) {
  console.log(data);
});


// check for clicks
document.addEventListener('click', function(event) {
  socket.emit('clickRequest', event.clientX, event.clientY)
})

socket.emit('new player');


var canvas = document.getElementById('canvas');
canvas.width = 1200;
canvas.height = 600;
var context = canvas.getContext('2d');

// Draw board
// Box width
var bw = 400;
// Box height
var bh = 400;
// Padding
var p = 10;

// redraw on new game state
socket.on('state', function(pieces) {
  // clear canvas area
  context.clearRect(0, 0, 1200, 600);

  // draw board
  for (var x = 0; x <= canvas.width; x += 40) {
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
  }
  
  for (var x = 0; x <= canvas.height; x += 40) {
    context.moveTo(0, x);
    context.lineTo(canvas.width, x);
  }
  
  context.strokeStyle = "black";
  context.stroke();

  context.fillStyle = "gray";
  // draw squares
  for(var i = 0; i < pieces.length; i++) {
    var row = pieces[i];
    for(var j = 0; j < row.length; j++) {
      if (row[j] == 1){
        context.fillRect(40 * j, 40 * i, 40, 40,)
      }
    }
  }

  // draw circles
  // context.fillStyle = 'green';
  // pieces.forEach(function(element) {
  //   context.beginPath();
  //   context.arc(element[0], element[1], 10, 0, 2 * Math.PI);
  //   context.fill();
  // });
  
});