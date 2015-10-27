(function(){
var MultiplicatorUnitFailure = function ( message ) {
  this.message = message;
  this.stack = ( new Error() ).stack ;
};

MultiplicatorUnitFailure.prototype = Object.create ( Error.prototype ) ;
MultiplicatorUnitFailure.prototype.name = "MultiplicatorUnitFailure";

var loader = function (){
  var primitiveMultiply = function ( numberOne , numberTwo ){
    while ( true ){
      try {
        var randomValue = Math.random() * 100;
        if ( randomValue < 20 ) return numberOne * numberTwo;
        throw new MultiplicatorUnitFailure("Trying Again");
      }
      catch ( error ){
        console.log( error.message );
      }
    }
  };

  console.log( primitiveMultiply(4,5) );
};



window.onload = loader;
})();
