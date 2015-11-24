var ActorBase = (function(){
  var dir4 = gameBase.dir4;
  var dir8 = gameBase.dir8;

  var Actor = function ( type , position , direction , speed , size ){
    this.type = type;
    this.position = position;
    this.direction = direction;
    this.size = size || new gameBase.Point ( 1 , 1 );
    this.speed = speed || 5;
  };

  Actor.prototype.getNextPosition = function ( dir ){

    if ( this.type == "Box" ) return this.position.plus ( dir8[ this.direction ].times( this.speed ) );
    else {
      console.log ( dir4[ this.direction ] , this.direction );
      return this.position.plus ( dir4[ dir ].times( this.speed ) )
    }
  };

  return {
    Actor : Actor,
  };

})();
