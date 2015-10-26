// Basic Runner Functions

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

var getDistance = function ( pointA , pointB ){
  return Math.max ( Math.abs( pointA.x - pointB.x ) , Math.abs( pointA.y - pointB.y ) );
};

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
