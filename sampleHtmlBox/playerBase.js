var playerBase = ( function ( ) {
  var player = function ( x , y , direction ){
    this.x = x;
    this.y = y;
    this.direction = direction;
  };


  return {
    player : player,
  };
})( );
