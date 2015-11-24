var gameGrid = (function ( ){
  var actorColors = gameBase.actorColors;
  var Point = gameBase.Point;
  var dir4 = gameBase.dir4;
  var dir8 = gameBase.dir8;

  var Grid = function ( canvas ){
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.width = canvas.width;
    this.height = canvas.height;

    this.space = new Array( this.width * this.height );

    this.cellOccupied = 0;

    for ( var i=0 ; i<this.width ; i++ ){
      for ( var j=0 ; j<this.height ; j++ )
        this.space[ i + j*this.width ] = actorColors.idOf ( "Empty" );
    }
  };

  Grid.prototype.setPixel = function ( pos , value ){
    this.space[ pos.x + pos.y * this.width ] = value;
  };

  Grid.prototype.getPixel = function ( pos ){
    return this.space[ pos.x + pos.y * this.width ];
  };

  Grid.prototype.draw = function ( ){
    for ( var i=0 ; i<this.width ; i++ ){
      for ( var j=0 ; j<this.height ; j++ ){
        this.context.fillStyle  = ( actorColors.getColorFromId( this.getPixel( new Point (i , j) ) ) );
        this.context.fillRect ( i , j , 1 , 1 );
      }
    }
  };

  Grid.prototype.eraseElement = function ( element ){
    this.context.fillStyle = actorColors.colorOf ( "Empty" );
    this.context.fillRect ( element.position.x , element.position.y , element.size.x , element.size.y );
  };

  Grid.prototype.drawElement = function ( element ){
    this.context.fillStyle = actorColors.colorOf ( element.type );
    this.context.fillRect ( element.position.x , element.position.y , element.size.x , element.size.y );
  };

  Grid.prototype.isValidMove = function ( pos ){
    return pos.x >= 0 && pos.x <= this.width && pos.y >= 0 && pos.y <= this.height;
  };

  Grid.prototype.refreshGrid = function ( box ){
    var curGrid = this;
    var tmpgrid = new Grid ( curGrid.canvas );

    for ( var i=0 ; i<curGrid.height ; i++ ){
      for ( var j=0 ; j<curGrid.width ; j++ ){
        tmpgrid.setPixel( new Point(i,j) , actorColors.idOf("Block") );
      }
    }

    var curQ = new Queue( );
    curQ.enqueue ( box.position );
    while ( !curQ.isEmpty() ) {
      var curPos = curQ.dequeue( );

      for ( var i=0 ; i<4 ; i++ ){
        var nxtPos = curPos.plus ( dir4[ i ] );
        if ( curGrid.isValidMove( nxtPos ) && curGrid.getPixel( nxtPos ) == actorColors.idOf( "Empty" ) && tmpgrid.getPixel ( nxtPos ) == actorColors.idOf("Block") ){
          curQ.enqueue ( nxtPos );
          tmpgrid.setPixel ( nxtPos , actorColors.idOf("Empty") );
        }
      }
    }

    curGrid.context.fillStyle = actorColors.colorOf("Block");
    for ( var i=0 ; i<curGrid.height ; i++ ){
      for ( var j=0 ; j<curGrid.width ; j++ ){
        var curPoint = new Point( i , j );
        if ( curGrid.getPixel( curPoint ) == actorColors.idOf("Player") ||
            (curGrid.getPixel( curPoint ) == actorColors.idOf("Empty")   &&
             tmpgrid.getPixel( curPoint ) == actorColors.idOf("Block")  ) ){
          curGrid.setPixel( curPoint , actorColors.idOf("Block")  );
          cellOccupied++;
        }
      }
    }
  };

  Grid.prototype.moveElement = function ( element ){
    if ( element.direction == -1 ) return ;
    this.eraseElement ( element );

    if ( element.type == "Box" ) element.position = element.position.plus ( dir8 [ element.direction ].times( element.speed ) );
    else element.position = element.position.plus ( dir4[ element.direction ] );

    this.drawElement ( element );
  };

  return {
    Grid : Grid,
  };

})();
