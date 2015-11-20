var gameGrid = (function(){
  var grid = function ( width , height ){
    this.space = new Array( width * height );
    this.width = width;
    this.height = height;
  };

  grid.prototype.setPixel = function ( x , y , value ){
    this.space[ x + y * this.width ] = value;
  };

  grid.prototype.getPixel = function ( x , y ){
    return this.space[ x + y * this.width ];
  };

  grid.prototype.drawGrid = function ( boxStates , colorOf , context ){
    for ( var y=0 ; y<this.height ; y++){
      for ( var x=0 ; x<this.width ; x++ ){
        
        var curValue = this.getPixel ( x , y );
        if ( curValue == boxStates.EMPTY ) context.fillStyle = colorOf.EMPTY;
        else if ( curValue == boxStates.PLAYER ) context.fillStyle = colorOf.PLAYER;
        else if ( curValue == boxStates.COVERED ) context.fillStyle = colorOf.COVERED;
        else context.fillStyle = colorOf.EMPTY;

        context.fillRect ( x , y , 1 , 1 );
      }
    }
  }

  return {
    grid : grid,
  };

})();
