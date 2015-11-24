(function(){

  var Point = gameBase.Point;
  var Actor = ActorBase.Actor;
  var CollisionHandler = collisionHandler.CollisionHandler;
  var Grid = gameGrid.Grid;
  var actorColors = gameBase.actorColors;

  var canvas = document.getElementById("boxHolder");
  var context = canvas.getContext ("2d");

  var curGameGrid;
  var player;
  var box;
  var gameRunning = false;
  var checker;
  var keyPressed;

  var boxMover;
  var playerMover;

  var isValidMove = function ( dir ){
    var nxtPos = player.getNextPosition ( dir );
    return nxtPos.x >= 0 && nxtPos.x <= curGameGrid.width && nxtPos.y >= 0 && nxtPos.y <= curGameGrid.height;
  };

  var onBorder = function ( dir ){
    var nxtPos = player.position;
    return nxtPos.x == 0 || nxtPos.x == curGameGrid.width || nxtPos.y == 0 || nxtPos.y == curGameGrid.height;
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


    if ( isValidMove( keyPressed ) ){
      if ( onBorder( keyPressed ) ){
        player.direction = keyPressed;
      }
      else if ( Math.abs( keyPressed - player.direction ) != 2 ){
          player.direction = keyPressed;
      }
    }


  };

  var moveBox = function ( ){
    var collision = checker.getCollisionPos( box );
    if ( !collision ) {
      curGameGrid.moveElement( box );
    }
    else {
      var colType = checker.getCollisionType ( collision );
      if ( colType == "Player" ) {
        ///
      }
      else {
        box.direction = checker.getDirection ( box , colType , collision );
      }
    }
  };



  var movePlayer = function ( ){
    console.log ( player.position );
    if ( player.direction == -1 ) return ;
    if ( !isValidMove ( player.direction ) ) return ;
    context.fillStyle = actorColors.colorOf("Player");
    for ( var i=0 ; i<player.speed ; i++ ){
      curGameGrid.moveElement ( player );
      if ( curGameGrid.getPixel( player.position ) != actorColors.idOf( "Block" ) ){
        console.log ("IN");
        curGameGrid.setPixel ( player.position , actorColors.idOf("Player") );
        context.fillRect ( player.position.x , player.position.y , 1 , 1 );
      }
    }
  };

  var startGame = function ( ){
    var fps = 20;
    gameRunning = true;

    document.addEventListener('keydown', keyPressHandler);

    ///                     Type           Position            Direction     Speed          Size
    player = new Actor ( "Player" , new Point(   0 , 100 )   ,    -1      ,    2    , new Point (  3 ,  3 ) );
    box = new Actor    ( "Box"    , new Point( 100 , 100 )   ,     5      ,    5    , new Point ( 50 , 50 ) );

    curGameGrid = new Grid ( canvas );
    checker = new CollisionHandler ( curGameGrid );

    boxMover = setInterval ( moveBox , 1000/fps );
    playerMover = setInterval ( movePlayer , 1000/fps );
  };

  var loader = function ( ){
    startGame( );
  };

  window.onload = loader;
})();
