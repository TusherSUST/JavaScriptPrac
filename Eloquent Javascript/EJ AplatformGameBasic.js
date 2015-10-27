

var Point = function ( x , y ) {
  this.x = x;
  this.y = y;
};

Point.prototype.plus = function ( otherPoint ) {
  return new Point ( this.x + otherPoint.x , this.y + otherPoint.y );
};

Point.prototype.times = function ( factor ) {
  return new Point ( this.x * factor , this.y * factor );
};

var arrowCodes = {37: "left" , 38: "up" , 39: "right"};

var trackKeys = function( codes ) {
  var pressed = Object.create( null );

  function handler ( event ){
    if ( codes.hasOwnProperty(event.keyCode) ){
      var down = event.type == "keydown";
      pressed[ codes[event.keyCode] ] = down;
      event.preventDefault();
    }
  }

  addEventListener ("keydown" , handler ) ;
  addEventListener ("keyup" , handler ) ;
  console.log ( pressed );
  return pressed ;
};

function runAnimation ( frameFunc ) {
  var lastTime = null;
  function frame ( time ){
    var stop = false;
    if ( lastTime != null ){
      var timeStep = Math.min ( time - lastTime , 100 ) / 1000;
      stop = frameFunc ( timeStep ) == false;
    }
    lastTime = time;
    if ( !stop )
      requestAnimationFrame ( frame );
  };
  requestAnimationFrame ( frame );
};

var arrows = trackKeys ( arrowCodes );

function runLevel ( level , Display , andThen ) {
  //console.log ( level );
  var display = new Display ( document.body , level );
  runAnimation ( function ( step ) {
    level.animate ( step , arrows );
    display.drawFrame ( step );
    if ( level.isFinished() ) {
      display.clear();
      if ( andThen )
        andThen ( level.status );
      return false;
    }
  });
};

function runGame ( plans , Display ) {
  // console.log ( plans );
  function startLevel ( n ){
    // console.log ( plans[n] );
    runLevel ( new Level( plans[n] ) , Display , function ( status ) {
      if ( status == "lost" ) startLevel ( n );
      else if ( n < plans.length-1 ) startLevel ( n+1 );
      else console.log ( "You Win!");
    } );
  }
  startLevel( 0 );
}
