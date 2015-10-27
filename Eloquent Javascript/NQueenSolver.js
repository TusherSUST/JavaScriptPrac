(function(){
var nQueen;
var myMap;
var queenPositions;

var createKey = function( a , b ){
  var curKey = "";
  curKey += (+a);
  for ( var i=0 ; i<b.length ; i++ ){
    curKey += ( +b[i] );
  }
  return curKey;
}

var isValidPosition = function( curX , curY , previousPositions ){
  var curLen = previousPositions.length;
  for ( var i=0 ; i<curLen ; i++ ){
    var nxtX = i;
    var nxtY = ( previousPositions[i] );

    if ( curY == nxtY ) return false;

    if ( Math.abs(curX - nxtX) == Math.abs(curY - nxtY) ) return false;
  }

  return true;
}

// Generates Valid Positions
// For number of queen < 11 can use string as second parameter
// to greatly reduce complexity
var generatePositions = function ( id , previousPositions ){
  if (id == nQueen ) {
    queenPositions.push( previousPositions );
    return ;
  }
  var curKey = createKey( id , previousPositions );
  if ( myMap[curKey] != undefined ) return ;

  for ( var i=0 ; i<nQueen ; i++ ){
      if ( isValidPosition( id , i , previousPositions ) ){
        if ( nQueen >10 ){
          previousPositions.push(i);
          generatePositions( id+1 , previousPositions );
          previousPositions.pop();
        }
        else generatePositions( id+1 , previousPositions + (+i) );
      }
  }

  myMap[curKey] = true;
}

var display = function( validPositions , resultField ){
  resultField.textContent = ( +validPositions );
}

var loaderFunction = function(){
    var submitButton = document.getElementById("myButton");
    var inputField = document.getElementById("firstInput");
    var resultField = document.getElementById("resultDisplayer");

    var userData;

    submitButton.addEventListener("click",function(){
      userData = firstInput.value;

      nQueen = userData;
      queenPositions = [];
      myMap = new Object();

      generatePositions( 0 , nQueen>10?[]:"");

      display( queenPositions.length , resultField );
    });
};

window.onload = loaderFunction;
})();
