// World Objects
var World = function( map , legend ) {
  var grid = new Grid( map[0].length , map.length );
  this.grid = grid;
  this.legend = legend;

  map.forEach ( function ( line , y ) {
    for ( var x=0 ; x<line.length ; x++ ){
      grid.setValueAt ( new Point( x , y ) , elementFromChar ( legend , line[x] ) );
    }
  } , grid);
};

World.prototype.toString = function ( ) {
  var output = "";
  for ( var y=0 ; y<this.grid.height ; y++ ){
    for ( var x=0 ; x<this.grid.width ; x++ ){
      var curChar = this.grid.getValueAt( new Point( x , y ) );
      output += charFromElement( curChar );
    }
    output += "\n";
  }
  return output;
};

World.prototype.getDestination = function ( action , point ) {
  if ( directions.hasOwnProperty( action.direction ) ){
    var destination = point.plus( directions[action.direction ] );
    if ( this.grid.isInside( destination ) )
      return destination;
  }
};

World.prototype.letCreepAct = function ( creep , point ) {
  var curAction = creep.act( new View( this , point ) );
  if ( curAction && curAction.type == "move" ){
    var destination = this.getDestination( curAction , point );
    if ( destination && this.grid.getValueAt(destination) == null ){
      this.grid.setValueAt ( point , null );
      this.grid.setValueAt ( destination , creep );
    }
  }
};

World.prototype.turnCreeps = function ( ) {
  var actedCreeps = [];
  this.grid.forEach( function ( creep , point ){
    if ( creep.act && actedCreeps.indexOf(creep) == -1 ){
      actedCreeps.push( creep );
      this.letCreepAct( creep , point );
    }
  } , this );
};

var LifelikeWorld = function ( map , legend ) {
  World.call( this , map , legend );
};

LifelikeWorld.prototype = Object.create( World.prototype );

LifelikeWorld.prototype.letCreepAct = function ( creep , point ){
  var curAction = creep.act ( new View(this,point) );
  var handled = curAction && curAction.type in actionTypes && actionTypes[ curAction.type ].call( this , creep , point , curAction );

  if ( !handled ){
    creep.energy -= 0.2;
    if ( creep.energy <= 0 ){
      this.grid.setValueAt ( point , null );
    }
  }

};

var BalancedWorld = function ( map , legend ){
  LifelikeWorld.call( this , map , legend );
  this.plantAmount = 0;
  this.creepAmount = 0;

  this.grid.forEach ( function( creep , point ){
    if ( creep.originalChar == "*" ) this.plantAmount++;
    if ( creep.originalChar == "o" ) this.creepAmount++;
  } , this );
};

BalancedWorld.prototype = Object.create(LifelikeWorld.prototype);

BalancedWorld.prototype.letCreepAct = function ( creep , point ){
  var curAction = creep.act ( new View(this,point) );
  var handled = curAction && curAction.type in actionTypes && actionTypes[ curAction.type ].call ( this , creep , point , curAction );

  if ( !handled ){
    creep.energy -= 0.2;
    if ( creep.energy <= 0 ){
      this.grid.setValueAt( point , null );
      this.creepAmount--;
    }
  }

};


var valley = new LifelikeWorld (
                  ["############################" ,
                   "#####                 ######" ,
                   "##    ***               **##" ,
                   "#    *##**        ** o   *##" ,
                   "# ***  o#              #***#" ,
                   "# o #          #*       ** #" ,
                   "# #                    #** #" ,
                   "#          o      #*       #" ,
                   "#* #*                  * o #" ,
                   "#*       ** #      #** o **#" ,
                   "##**** #          ##*** *###" ,
                   "############################"] ,
                  { "#": Wall ,
                    "o": PlantEater ,
                    "*": Plant }
                  );
var balencedValley = new BalancedWorld (
                  ["############################" ,
                   "#####                 ######" ,
                   "##    ***               **##" ,
                   "#    *##**        ** o   *##" ,
                   "# ***  o#              #***#" ,
                   "# o #          #*       ** #" ,
                   "# #                    #** #" ,
                   "#          o      #*       #" ,
                   "#* #*                  * o #" ,
                   "#*       ** #      #** o **#" ,
                   "##**** #          ##*** *###" ,
                   "############################"] ,
                  { "#": Wall ,
                    "o": BalencedPlantEater ,
                    "*": BalencedPlant }
                  );
