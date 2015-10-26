// Creep Declarations
var Creep = function ( ) {
  this.direction = randomElement ( directionNames );
};

Creep.prototype.act = function ( view ) {
  if ( view.look ( this.direction ) != " " ) this.direction = view.find(" ") || "s";
  return {type:"move" , direction : this.direction};
};

var WallFollower = function ( ) {
  this.direction = "s";
};

WallFollower.prototype.act = function ( view ) {
  var start = this.direction;
  if ( view.look( directionPlus( this.direction , -3 ) ) != " " ){
    start = this.direction = directionPlus( this.direction , -2 );
  }

  while ( view.look( this.directions ) != " " ){
    this.direction = directionPlus ( this.direction , 1 );
    if ( this.direction == start ) break;
  }

  return { type:"move" , direction:this.direction };
};

var Plant = function ( ) {
  this.energy = 3 + Math.random() * 4;
};

Plant.prototype.act = function ( view ) {
  if ( this.energy > 15 ){
    var space = view.find(" ");
    if ( space ){
      return {type:"reproduce",direction:space};
    }
  }
  if ( this.energy < 20 ){
    return {type:"grow"};
  }
};

var PlantEater = function ( ) {
  this.energy = 20;
};

PlantEater.prototype.act = function ( view ) {
  var space = view.find( " " );
  if ( this.energy > 60 && space )
    return {type:"reproduce",direction:space};
  var plant = view.find("*");
  if ( plant )
    return {type:"eat",direction:plant};
  if ( space )
    return {type:"move",direction:space};
};

var BalencedPlant = function ( ){
  this.energy = 3 + Math.random() * 4;
};

BalencedPlant.prototype.act = function ( view ){
  if ( this.energy > 15 && view.world.plantAmount < 10 ){
    var space = view.find(" ");
    if ( space ){
      view.world.plantAmount++;
      return {type:"reproduce",direction:space};
    }
  }
  if ( this.energy < 20 ){
    return {type:"grow"};
  }
};

var BalencedPlantEater = function ( ){
  this.energy = 20;
};

BalencedPlantEater.prototype.act = function ( view ){
  var space = view.find( " " );
  if ( this.energy > 60 && space && view.world.creepAmount < 10 ){
    view.world.creepAmount++;
    return {type:"reproduce",direction:space};
  }

  var plant = view.find("*");
  if ( plant && view.world.plantAmount > 5 ) {
    view.world.plantAmount--;
    return {type:"eat",direction:plant};
  }

  if ( space ){
    var nxtDirection = this.getDirectionOfPlant( view , space );

    if ( nxtDirection )
      return {type:"move",direction:nxtDirection};
  }

};

BalencedPlantEater.prototype.getDirectionOfPlant = function ( view , space ){
  var chosenDirection;
  var minDistance = Number.MAX_VALUE;
  var chosenPoint = false;

  view.world.grid.forEach( function( creep , point ) {
    if ( creep.originalChar == "*" ){
      var curDistance = getDistance( view.point , point );
      if ( curDistance < minDistance ){
        minDistance = curDistance;
        chosenPoint = point;
      }
    }
  }, view.world );
  if ( !chosenPoint ) return false;

  var spaceDistance = Number.MAX_VALUE;
  for ( var i=0 ; i<space.length ; i++ ){
    var nxtDistance = getDistance ( view.point.plus( directions[space[i]] ) , chosenPoint );
    if ( nxtDistance < spaceDistance ){
      spaceDistance = nxtDistance;
      chosenDirection = space[i];
    }
  }
  return chosenDirection;
};

function Wall () {};
