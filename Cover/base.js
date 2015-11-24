var gameBase = (function(){

  var Point = function ( x , y ){
    this.x = x;
    this.y = y;
  };

  Point.prototype.plus = function ( toAdd ){
    return new Point ( this.x + toAdd.x , this.y + toAdd.y );
  };

  Point.prototype.times = function ( toMultiply ){
    return new Point ( this.x * toMultiply , this.y * toMultiply );
  };

  var dir8 = [
    new Point ( -1 , -1 ),
    new Point (  0 , -1 ),
    new Point (  1 , -1 ),
    new Point (  1 ,  0 ),
    new Point (  1 ,  1 ),
    new Point (  0 ,  1 ),
    new Point ( -1 ,  1 ),
    new Point ( -1 ,  0 )
  ];

  var dir4 = [
    new Point ( -1 ,  0 ),
    new Point (  0 , -1 ),
    new Point (  1 ,  0 ),
    new Point (  0 ,  1 )
  ];

  var actorColors = {
    "Player" : "#0000FF",
    "Box" : "#FF0000",
    "Empty" : "#FFFFFF",
    "Block" : "#000000"
  };

  actorColors.idOf = function ( type ){
    if ( type == "Empty" ) return 0;
    if ( type == "Player" ) return 1;
    if ( type == "Box" ) return 2;
    if ( type == "Block" ) return 3;
  };

  actorColors.typeOf = function ( id ){
    if ( id == 0 ) return "Empty";
    if ( id == 1 ) return "Player";
    if ( id == 2 ) return "Box";
    if ( id == 3 ) return "Block";
  };

  actorColors.colorOf = function ( type ){
    return this[type];
  };

  actorColors.getColorFromId = function ( id ){
    return this.colorOf ( this.typeOf(id) );
  }

  var getDistance = function ( a , b ){
    return ( a.x - b.x ) * ( a.x - b.x ) + ( a.y - b.y ) * ( a.y - b.y );
  }


  return {
    Point : Point,
    dir8 : dir8,
    dir4 : dir4,
    actorColors : actorColors,
    getDistance : getDistance
  };

})();
