var collisionHandler = (function(){

  var actorColors = gameBase.actorColors;
  var dir4 = gameBase.dir4;
  var dir8 = gameBase.dir8;
  var getDistance = gameBase.getDistance;
  var Point = gameBase.Point;

  var CollisionHandler = function ( grid ){
    this.grid = grid;
  };

  CollisionHandler.prototype.getCollisionType = function ( pos ){
    if ( pos.x <= 0 || pos.x >= this.grid.width || pos.y <= 0 || pos.y >= this.grid.height ) return "Border";
    if ( this.grid.getPixel( pos ) == actorColors.idOf("Player") ) return "Player";
    return "Block";
  };

  CollisionHandler.prototype.getCollisionPos = function ( element ){
    var nxtPos = element.getNextPosition( );
    var curGrid = this.grid;
    for ( var i=nxtPos.x ; i<=nxtPos.x + element.size.x ; i++ ){
      for ( var j=nxtPos.y ; j<=nxtPos.y + element.size.y ; j++ ){
        var curPoint = new Point ( i , j );
        if ( curGrid.getPixel ( curPoint ) != actorColors.idOf( "Empty" ) ){
          return curPoint;
        }
        if ( curPoint.x <= 0 || curPoint.x >= this.grid.width || curPoint.y <= 0 || curPoint.y >= this.grid.height ){
          return curPoint;
        }
      }
    }

    return false;
  };

  CollisionHandler.prototype.getBorderCollisionDirection = function ( element ){
    var dir = element.direction;

    if ( dir%2 == 1 ) {
      return ( dir + 4 ) % 8;
    }

    var curDir = dir;
    var curBox = element.position;

    var curBox = element.position.plus ( dir8[ dir ].times( element.speed ) );

    if ( dir == 0 ){
      if ( curBox.y <= 0 ) curDir = 6;
      else curDir = 2;
    }
    else if ( dir == 2 ){
      if ( curBox.y <= 0 ) curDir = 4;
      else curDir = 0;
    }
    else if ( dir == 4 ){
      if ( curBox.x + curBox.width >= this.grid.width ) curDir = 6;
      else curDir = 2;
    }
    else if ( dir == 6 ){
      if ( curBox.x <= 0 ) curDir = 4;
      else curDir = 0;
    }

    return curDir;
  };

  CollisionHandler.prototype.getBlockCollisionDirection = function ( element , collisionPoint ){

    var midX = ( 2*element.position.x + element.size.x ) / 2;
    var midY = ( 2*element.position.y + element.size.y ) / 2;
    var halfX = ( element.size.x / 2 );
    var halfY = ( element.size.y / 2 );

    var maxVal = -10000;
    var newDirection = 0;

    for ( var i=0 ; i<8 ; i++ ){
      var curX = midX + ( dir8[i].x * halfX );
      var curY = midY + ( dir8[i].y * halfY );
      var curDist = getDistance ( new Point(curX , curY) ,  collisionPoint );
      if ( curDist > maxVal && (curBox.direction != (i+4)%8 ) ) {
        maxVal = curDist;
        newDirection = i;
      }
    }

    return newDirection;
  };

  CollisionHandler.prototype.getDirection = function ( element , collisionType , collisionPoint ){
    if ( collisionType == "Border" ) return this.getBorderCollisionDirection( element );
    else if ( collisionType == "Block" ) return this.getBlockCollisionDirection( element , collisionPoint );
  };

  return {
    CollisionHandler : CollisionHandler,
  };
})();
