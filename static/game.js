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
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

// Draw board
var bw = 400;
// Box height
var bh = 400;
// Padding
var p = 10;

// redraw on new game state
socket.on('state', function(pieces) {
  // clear canvas area
  context.clearRect(0, 0, 800, 600);

  // draw board
  for (var x = 0; x <= bw; x += 40) {
    context.moveTo(0.5 + x + p, p);
    context.lineTo(0.5 + x + p, bh + p);
  }
  
  for (var x = 0; x <= bh; x += 40) {
    context.moveTo(p, 0.5 + x + p);
    context.lineTo(bw + p, 0.5 + x + p);
  }
  
  context.strokeStyle = "black";
  context.stroke();

  // draw circles
  context.fillStyle = 'green';
  pieces.forEach(function(element) {
    context.beginPath();
    context.arc(element[0], element[1], 10, 0, 2 * Math.PI);
    context.fill();
  });
  
});