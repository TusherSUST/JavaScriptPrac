(function(){
  var canvas = document.getElementById("boxHolder");
  var context = canvas.getContext("2d");

  var dirX = [ -1 ,  0 ,  1 , 1 , 1 , 0 , -1 , -1 ];
  var dirY = [ -1 , -1 , -1 , 0 , 1 , 1 ,  1 ,  0 ];

  var dir4X = [ -1 ,  0 , 1 , 0 ];
  var dir4Y = [  0 , -1 , 0 , 1 ];

  var boxStates = {
    EMPTY : 0,
    MOVINGBOX : 1,
    COVERED : 2,
    PLAYER : 3,
  };

  var colorOf = {
    EMPTY : "#FFFFFF",
    MOVINGBOX : "#FF0000",
    COVERED : "#000000",
    PLAYER : "#0000FF",
  };

  var collisionChecker;
  var moveInterval;
  var mouseHandler;
  var playerMover;
  var keyBoardHandler;


  var cellOccupied = 0;
  var gameOverImage = new Image();
  gameOverImage.src = "game-over.jpg";
  var gameWonImage = new Image();
  gameWonImage.src = "game-won.jpg";


  var curBox = new boxBase.box ( 10 , 10 , 50 , 50 , 4 );
  var curGameGrid = new gameGrid.grid( canvas.width , canvas.height );
  var player = new playerBase.player ( 0 , 50 , -1 );
  var speed = 5;
  var mousePos;
  var keyPressed = -1;

  var clearIntervals = function( ){
    clearInterval ( collisionChecker );
    clearInterval ( moveInterval );
    clearInterval ( mouseHandler );
    clearInterval ( playerMover );
    clearInterval ( keyBoardHandler );
  }

  var getMousePos = function ( curCanvas, evt) {
    var rect = curCanvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  var moveBox = function ( ){
    curBox.eraseBox ( context );
    curBox.x += speed * dirX[ curBox.direction ];
    curBox.y += speed * dirY[ curBox.direction ];
    curBox.draw ( context );
  };

  var collidedWithBlock = function ( addX , addY ){
    addX *= 2;
    addY *= 2;
    for ( var i=curBox.x + addX ; i<=curBox.x + curBox.width + addX ; i++ ){
      for ( var j=curBox.y + addY ; j<=curBox.y + curBox.height + addY ; j++ ){
        if ( curGameGrid.getPixel( i , j ) == boxStates.COVERED ){
          return {x:i,y:j};
        }
      }
    }
    return false;
  };

  var getRandomDirection = function ( ){
    while (true) {
      var randomDir = Math.floor ( Math.random() * 8 );
      var addX = speed * dirX[ randomDir ];
      var addY = speed * dirY[ randomDir ];
      if ( curBox.x + addX > 0 && ( curBox.x + curBox.width + addX ) < canvas.width &&
           curBox.y + addY > 0 && ( curBox.y + curBox.height + addY ) < canvas.height && !collidedWithBlock( addX , addY ) ){
             return randomDir;
           }
    }
    return 0;
  };

  var getBounceDirection = function ( ){
    var dir = curBox.direction;
    if ( dir%2 == 1 ) {
      curBox.direction = ( dir + 4 ) % 8;
      moveBox();
      return ;
    }

    var addX = speed * dirX[ dir ];
    var addY = speed * dirY[ dir ];

    var curDir = dir;

    if ( dir == 0 ){
      if ( curBox.y + addY <= 0 ) curDir = 6;
      else curDir = 2;
    }
    else if ( dir == 2 ){
      if ( curBox.y + addY <= 0 ) curDir = 4;
      else curDir = 0;
    }
    else if ( dir == 4 ){
      if ( curBox.x + curBox.width + addX >= canvas.width ) curDir = 6;
      else curDir = 2;
    }
    else if ( dir == 6 ){
      if ( curBox.x + addX <= 0 ) curDir = 4;
      else curDir = 0;
    }

    curBox.direction = curDir;
    moveBox();
  };

  var collidedWithPlayer = function ( ){
    for ( var i=curBox.x ; i<=curBox.x + curBox.width ; i++ ){
      for ( var j=curBox.y ; j<=curBox.y + curBox.height ; j++ ){
        if ( curGameGrid.getPixel( i , j ) == boxStates.PLAYER )
          return true;
      }
    }

    return false;
  };

  var getBlockCollisionDirection = function ( collisionPoint ){
    var midX = ( curBox.x + curBox.x + curBox.width ) / 2;
    var midY = ( curBox.y + curBox.y + curBox.height ) / 2;
    var halfX = ( curBox.width / 2 );
    var halfY = ( curBox.height / 2 );

    var maxVal = -100;
    var newDirection = getRandomDirection( );

    for ( var i=0 ; i<8 ; i++ ){
      var curX = midX + ( dirX[i] * halfX );
      var curY = midY + ( dirY[i] * halfY );
      var curDist = getDistance ( curX , curY ,  collisionPoint.x , collisionPoint.y );
      if ( curDist > maxVal && (curBox.direction != (i+4)%8 ) ) {
        maxVal = curDist;
        newDirection = i;
      }
    }

    curBox.direction = newDirection;
  };


  var checkCollision = function ( ){
    var addX = speed * dirX[ curBox.direction ];
    var addY = speed * dirY[ curBox.direction ];
    if ( collidedWithPlayer( ) ){
      clearIntervals();
      context.drawImage ( gameOverImage , 0 , 0 , 600 , 600 );
      return ;
    }

    var blockCollision = collidedWithBlock( addX , addY );

    if ( blockCollision ){
      getBlockCollisionDirection( blockCollision );
      return ;
    }


    if ( curBox.x + addX <= 0 || ( curBox.x + curBox.width + addX ) >= canvas.width ||
         curBox.y + addY <= 0 || ( curBox.y + curBox.height + addY ) >= canvas.height ){
           getBounceDirection();
         }

  };

  var getDistance = function ( curX , curY , nx , ny ) {
    return ( curX - nx ) * ( curX - nx ) + ( curY - ny ) * ( curY - ny );
  };

  var getNewDirection = function ( ) {
    var midX = ( curBox.x + curBox.x + curBox.width ) / 2;
    var midY = ( curBox.y + curBox.y + curBox.height ) / 2;
    var halfX = ( curBox.width / 2 );
    var halfY = ( curBox.height / 2 );

    var maxVal = -100;
    var newDirection = getRandomDirection( );

    for ( var i=0 ; i<8 ; i++ ){
      var curX = midX + ( dirX[i] * halfX );
      var curY = midY + ( dirY[i] * halfY );
      var curDist = getDistance ( curX , curY , mousePos.x , mousePos.y );
      if ( curDist > maxVal ) {
        maxVal = curDist;
        newDirection = i;
      }
    }

    curBox.direction = newDirection;
  };

  var isValidMove = function ( curX , curY ) {
    if ( curX < 0 || curX > canvas.width || curY < 0 || curY > canvas.height ) return false;
    return true;
  }

  var mouseEventChecker = function ( ){
    if ( mousePos.x >= curBox.x && mousePos.x <= curBox.x + curBox.width &&
         mousePos.y >= curBox.y && mousePos.y <= curBox.y + curBox.height ){
          getNewDirection(  );
    }
  };

  var refreshGrid = function ( ) {

    var tmpgrid = new gameGrid.grid ( canvas.width , canvas.height );

    for ( var i=0 ; i<canvas.height ; i++ ){
      for ( var j=0 ; j<canvas.width ; j++ ){
        tmpgrid.setPixel(i,j,boxStates.COVERED);
      }
    }

    var curQ = new Queue( );
    curQ.enqueue ( { x:curBox.x , y:curBox.y } );

    while ( !curQ.isEmpty() ) {
      var curPos = curQ.dequeue( );
      var cx = curPos.x;
      var cy = curPos.y;

      for ( var i=0 ; i<4 ; i++ ){
        var nx = cx + dir4X[ i ];
        var ny = cy + dir4Y[ i ];

        if ( isValidMove( nx , ny ) && curGameGrid.getPixel( nx , ny ) == boxStates.EMPTY && tmpgrid.getPixel ( nx , ny ) == boxStates.COVERED ){
          curQ.enqueue ( { x : nx , y : ny } );
          tmpgrid.setPixel ( nx , ny , boxStates.EMPTY );
        }
      }
    }

    context.fillStyle = colorOf.COVERED;
    for ( var i=0 ; i<canvas.height ; i++ ){
      for ( var j=0 ; j<canvas.width ; j++ ){
        if ( curGameGrid.getPixel( i , j ) == boxStates.PLAYER ||
            (curGameGrid.getPixel( i , j ) == boxStates.EMPTY  &&
             tmpgrid.getPixel( i , j ) == boxStates.COVERED ) ){
          curGameGrid.setPixel( i , j , boxStates.COVERED );
          context.fillRect ( i , j , 1 , 1 );
          cellOccupied++;
        }
      }
    }

  };

  var movePlayer = function ( ) {
    console.log ( player );
    if ( cellOccupied >= ( ( canvas.width * canvas.height ) * 75) / 100 ){
      clearIntervals();
      context.drawImage ( gameWonImage , 0 , 0 , 600 , 600 );
      return ;
    }
    if ( player.direction == -1 ) return ;

    var dir = player.direction;
    context.fillStyle = colorOf.PLAYER;
    context.fillRect ( player.x , player.y , 1 , 1 );
    curGameGrid.setPixel ( player.x , player.y , boxStates.PLAYER );
    for ( var i=0 ; i<speed ; i++ ){
      var nx = player.x + dir4X[ dir ];
      var ny = player.y + dir4Y[ dir ];

      if ( isValidMove ( nx , ny ) && curGameGrid.getPixel ( nx , ny ) == boxStates.PLAYER ){
        /// LIFE SHES
        clearIntervals();
        context.drawImage ( gameOverImage , 0 , 0 , 600 , 600 );
      }
      else if ( isValidMove ( nx , ny ) && curGameGrid.getPixel ( nx , ny ) == boxStates.EMPTY ){
        player.x = nx;
        player.y = ny;

        context.fillRect ( player.x , player.y , 1 , 1 );
        curGameGrid.setPixel ( nx , ny , boxStates.PLAYER );
        gridRefreshed = false;
      }
      else if ( !gridRefreshed ){
        refreshGrid ( );
        gridRefreshed = true;
        return ;
      }
    }

  };

  var keyPressHandler = function(event) {
    event.preventDefault( );
    if(event.keyCode == 37) {
      keyPressed = 0;
    }
    else if(event.keyCode == 39) {
      keyPressed = 2;
    }
    else if ( event.keyCode == 38 ) {
      keyPressed = 1;
    }
    else if ( event.keyCode == 40 ){
      keyPressed = 3;
    }
  };

  var keyBoardEventChecker = function ( ) {
    if ( Math.abs( keyPressed - player.direction ) != 2 )
      player.direction = keyPressed;
  };

  var loader = function ( ){
    var fps = 10;

    canvas.addEventListener('mousemove', function(evt) {
      mousePos = getMousePos( canvas, evt);
    }, false);

    for ( var i=0 ; i<canvas.height ; i++ ){
      for ( var j=0 ; j<canvas.width ; j++ ){
        curGameGrid.setPixel(i,j,boxStates.EMPTY);
      }
    }


    document.addEventListener('keydown', keyPressHandler);

    collisionChecker = setInterval ( checkCollision , 1000/fps );
    moveInterval = setInterval ( moveBox , 1000/fps );
    // mouseHandler = setInterval ( mouseEventChecker , 1000/fps );
    playerMover = setInterval ( movePlayer , 1000/fps );
    keyBoardHandler = setInterval ( keyBoardEventChecker , 1000/fps );


  };

  window.onload = loader;
})();
