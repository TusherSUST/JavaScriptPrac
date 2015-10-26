// (function(){

// Basic RUnner Functions

var randomElement = function ( array ) {
  return array[Math.floor(Math.random() * array.length)];
};

var directions = {
  "n"  : new Point ( 0 , -1 ) ,
  "ne" : new Point ( 1 , -1 ) ,
  "e"  : new Point ( 1 ,  0 ) ,
  "se" : new Point ( 1 ,  1 ) ,
  "s"  : new Point ( 0 ,  1 ) ,
  "sw" : new Point ( -1 , 1 ) ,
  "w"  : new Point ( -1 , 0 ) ,
  "nw" : new Point ( -1 ,-1 )
};

var directionNames = "n ne e se s sw w nw". split (" ") ;

var elementFromChar = function( legend , char ) {
  if ( char == " " ) return null;
  var element = new legend[char]();
  element.originalChar = char;
  return element;
};

var charFromElement = function ( element ) {
  if ( element == null ) return " ";
  return element.originalChar;
};

var directionPlus = function ( curDirection , newDirection ){
  var index = directionNames.indexOf ( curDirection );
  return directionNames[(index + newDirection + 8) % 8];
};

// Basic Point
function Point ( x , y ) {
  this.x = x;
  this.y = y;
};

Point.prototype.plus = function ( other ) {
  return new Point ( this.x + other.x , this.y + other.y ) ;
};

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

function Wall () {};

// Basic Grid
var Grid = function ( width , height ) {
  this.space = new Array( width * height );
  this.width = width;
  this.height = height;
};

Grid.prototype.isInside = function ( point ) {
  return point.x >= 0 && point.x < this.width &&
         point.y >= 0 && point.y < this.height ;
};

Grid.prototype.getValueAt = function ( point ) {
  return this.space [ point.x + this.width * point.y ];
};

Grid.prototype.setValueAt = function ( point , value ) {
  this.space [ point.x + this.width * point.y ] = value ;
};

Grid.prototype.forEach = function ( callBack , context ) {
  for ( var y = 0; y < this.height ; y++ ) {
    for ( var x = 0; x < this.width ; x++ ) {
      var curValue = this.space [ x + y * this.width ];
      if ( curValue != null )
          callBack.call ( context , curValue , new Point ( x , y ) ) ;
    }
  }
};

// Action Types
var actionTypes = Object.create(null);

actionTypes.grow = function ( creep ) {
  creep.energy += 0.5;
  return true ;
};

actionTypes.move = function ( creep , point , action ){
  // console.log("movin");
  var destination = this.getDestination ( action , point );
  if ( destination == null || creep.energy <= 1
      || this.grid.getValueAt( destination ) != null ){
        return false;
  }
  creep.energy -= 1;
  this.grid.setValueAt ( point , null );
  this.grid.setValueAt ( destination , creep );
  return true;
};

actionTypes.eat = function ( creep , point , action ){
  var destination = this.getDestination ( action , point );
  var atDestination = (destination != null) && this.grid.getValueAt ( destination );
  if ( !atDestination ||  atDestination.energy == null ){
        return false;
  }
  creep.energy += atDestination.energy;
  this.grid.setValueAt ( destination , null );
  return true;
};

actionTypes.reproduce = function ( creep , point , action ){
  var baby = elementFromChar ( this.legend , creep.originalChar );
  var destination = this.getDestination ( action , point );
  if ( destination == null || creep.energy <= 2 * baby.energy
       || this.grid.getValueAt( destination ) != null ) {
    return false;
  }
  creep.energy -= 2 * baby.energy;
  this.grid.setValueAt ( destination , baby );
  return true;
};

// View Object
var View = function ( world , point ) {
  this.world = world;
  this.point = point;
};

View.prototype.look = function ( direction ) {
  var target = this.point.plus ( directions [ direction ]) ;
  if ( this.world.grid.isInside ( target ) )
    return charFromElement ( this.world.grid.getValueAt ( target ) ) ;
  else
    return "#";
};

View.prototype.findAll = function ( char ) {
  var found = [];
  for ( var dir in directions )
    if ( this.look ( dir ) == char )
      found.push ( dir ) ;
  return found ;
};

View.prototype.find = function ( char ) {
  var found = this.findAll ( char ) ;
  if ( found.length == 0) return null ;
  return randomElement ( found ) ;
};

// World Objects
var World = function( map , legend ) {
  var grid = new Grid( map[0].length , map.length );
  this.grid = grid;
  this.legend = legend;

  map.forEach ( function ( line , y ) {
    for ( var x=0 ; x<line.length ; x++ ){
      grid.setValueAt ( new Point( x , y ) , elementFromChar ( legend , line[x] ) );
    }
  });
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

// Main Loader
// var Loader = function() {
//   // //console.log("in");
//   // var plan = ["############################" ,
//   //             "#       # # o #            #" ,
//   //             "#                          #" ,
//   //             "#       #####              #" ,
//   //             "##      # # #    #         #" ,
//   //             "#        ## # # #          #" ,
//   //             "#          #    ## #       #" ,
//   //             "#   ####                   #" ,
//   //             "#   ## o                   #" ,
//   //             "#  o # o     ###           #" ,
//   //             "#    #                     #" ,
//   //             "############################"];
//   //
//   //   var world = new World ( plan , {"#" : Wall ,
//   //                                   "o" : Creep }) ;
//   //   // console.log(world.toString());
//   //   for ( var i=0 ; i<5 ; i++ ){
//   //     world.turnCreeps();
//   //     console.log(world.toString());
//   //   }
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
//   for ( var i=0 ; i<5 ; i++ ){
//       valley.turnCreeps();
//       console.log(valley.toString());
//   }
// };


// window.onload = Loader;
// })();
