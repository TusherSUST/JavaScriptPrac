var BaseOperations = (function (){

  var drawObject = function ( object , context ){
    context.drawImage(object.image, object.x, object.y);
  }

  var getVideoStream = function ( video ){
    try {
        compatibility.getUserMedia({video:true}, function(stream) {
        try {
          video.src = compatibility.URL.createObjectURL(stream);
        } catch (error) {
          video.src = stream;
        }
      }, function (error) {
        alert("WebRTC not available");
      });
    } catch (error) {
      alert(error);
    }
  }

  var checkCollisions = function ( actor , objects ){
    for ( var i=0 ; i<objects.length ; i++ ){
      if ( hasCollided ( actor , objects[i] ) )
        return true;
    }

    return false;
  }

  var hasCollided = function ( actor , object ){
     return (actor.x < object.x + object.width  &&
             actor.x + actor.width > object.x   &&
             actor.y < object.y + object.height &&
             actor.height + actor.y > object.y);
  }


  var getRandomNumber = function ( ){
    return Math.random() * 100;
  }

  var canAddObstacle = function ( obstaclesOnScreen ){
    if ( !obstaclesOnScreen.length ) return true;
    var prevObsY = ( obstaclesOnScreen[ obstaclesOnScreen.length - 1 ] ).y;
    return prevObsY > 250;
  }

  var removeObject = function(object , context) {
    context.save();
    context.clearRect(object.x, object.y, object.width, object.height);
    context.restore();
  }

  var animate = function (obstacle, startTime , linearSpeed , obstaclesOnScreen ) {
    if ( wisp.gameStatus() ) return ;
    var time = (new Date()).getTime() - startTime;

    var newY = linearSpeed * time / 1000;

    var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext("2d");

    context.clearRect(obstacle.x, obstacle.y - 2, obstacle.width + 1, obstacle.height);
    if (newY < canvas.height - obstacle.height / 4) {
      obstacle.y = newY;
    }
    else {
      removeObject(obstacle,context);
      var index = obstaclesOnScreen.indexOf(obstacle);
      if (index > -1) {
          obstaclesOnScreen.splice(index, 1);
      }
      return ;
    }

    drawObject(obstacle , context);

    compatibility.requestAnimationFrame ( function () {
      animate ( obstacle , startTime , linearSpeed , obstaclesOnScreen );
    });
  }

  var moveLeft = function( player , context , gameFinished ) {
    if (gameFinished) return;
    if (player.x === 35) return;
    removeObject(player,context);
    player.x = player.x - 100;
    drawObject(player , context);
  };
  var moveRight = function( player , context , gameFinished ) {
    if (gameFinished) return;
    if (player.x === 235) return;
    removeObject(player,context);
    player.x = player.x + 100;
    drawObject(player , context);
  };
  var moveUp = function( player , context , gameFinished ) {
    if (gameFinished) return;
    removeObject(player,context);
    player.y = player.y - 100;
    player.y = Math.max ( 0 , player.y );
    drawObject(player , context);
  };
  var moveDown = function( player , context , gameFinished ) {
    if (gameFinished) return;
    removeObject(player,context);
    player.y = player.y + 100;
    player.y = Math.min ( 600 , player.y );
    drawObject(player , context);
  };


  var oldPos;

  var getMovement = function ( video , detector , canvas ){
    var context = canvas.getContext("2d");

    if (!detector) {
        var width = ~~(80 * video.videoWidth / video.videoHeight);
        var height = 80;
        // console.log ( width , height );
        detector = new objectdetect.detector(width, height, 1.1 , objectdetect.frontalface);
    }

    var coords = detector.detect(video , 1);
    if (coords[0]) {
      var coord = coords[0];

      /* Rescale coordinates from detector to video coordinate space: */
      coord[0] *= video.videoWidth / detector.canvas.width;
      coord[1] *= video.videoHeight / detector.canvas.height;
      coord[2] *= video.videoWidth / detector.canvas.width;
      coord[3] *= video.videoHeight / detector.canvas.height;

      /* Find coordinates with maximum confidence: */
      var coord = coords[0];
      for (var i = coords.length - 1; i >= 0; --i)
        if (coords[i][4] > coord[4]) coord = coords[i];

      /* Scroll window: */
      var fistPos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
      // console.log ("Detected");
      if (oldPos) {
        var dx = (fistPos[0] - oldPos[0]) / video.videoWidth,
            dy = (fistPos[1] - oldPos[1]) / video.videoHeight;

            if ( dx > 0 ) {
              return "left";
            }
            else if ( dx < 0 ) {
              return "right";
            }
            if ( dy > 0 ){
              return "down";
            }
            else if ( dy < 0 ){
              return "up";
            }
      }
      else oldPos = fistPos;

      context.beginPath();
      context.lineWidth = '2';
      context.fillStyle = 'rgba(0, 255, 255, 0.5)';
      context.fillRect(
        coord[0] / video.videoWidth * canvas.clientWidth,
        coord[1] / video.videoHeight * canvas.clientHeight,
        coord[2] / video.videoWidth * canvas.clientWidth,
        coord[3] / video.videoHeight * canvas.clientHeight);
      context.stroke();
    }
    else oldPos = null;

    return "none";
}



  return {
    checkCollisions : checkCollisions,
    hasCollided : hasCollided,
    getRandomNumber : getRandomNumber,
    canAddObstacle : canAddObstacle,
    animate : animate,
    drawObject : drawObject,
    getVideoStream : getVideoStream,
    getMovement : getMovement,
    moveLeft : moveLeft,
    moveRight : moveRight,
    moveUp : moveUp,
    moveDown : moveDown,
    removeObject : removeObject,

  };

})();
