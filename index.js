var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var Xpos = 120;
  var Ypos = 40;
  var servoY = new five.Servo(5);
  var servoX = new five.Servo(6);
  this.repl.inject({
    servoY: servoY,
    servoX: servoX,
  });

  servoY.to(Ypos);
  servoX.to(Xpos);
  var express = require('express');
  var app = express();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  app.use(express.static('public'));
  var speed=1;
  var sens = 30;
  io.on('connection', function(socket){
    console.log('Connection established');
    socket.on('track',function(data){
      if(typeof data.sens != 'undefined' && data.sens != sens){
        sens = data.sens;
      }
      if(typeof data.speed != 'undefined' && data.speed != speed){
        speed = data.speed;
      }
      console.log(data)
      var centerX = data.x + (data.width/2);
      var centerY = data.y + (data.height/2);
      if(centerX < (data.frameW/2) - sens){
        Xpos += speed
      }else if(centerX > (data.frameW/2) + sens){
        Xpos -= speed
      }
      if(centerY < (data.frameH/2) - sens){
        Ypos += speed
      }else if(centerY > (data.frameH/2) + sens){
        Ypos -= speed
      }

      Ypos = Math.max(0,Math.min(180,Ypos))
      Xpos = Math.max(0,Math.min(180,Xpos))
      servoX.to(Xpos)
      servoY.to(Ypos)

    })
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

});
