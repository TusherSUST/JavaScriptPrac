(function(){

var Loader = function(){
    var boardLength = 8;
    var board = "";
    var charTracker = true;
    for ( var i=0 ; i<boardLength*boardLength ; i++ ){
        if ( (i%boardLength == 0) && i ) {
          board += "\r\n";
          if ( boardLength%2 == 0 ) charTracker = (1-charTracker);
        }

        if ( charTracker ){
            if ( i%2 == 0 ) board += " ";
            else board += "#";
        }
        else {
            if ( i%2 == 0 ) board += "#";
            else board += " ";
        }

    }

    console.log(board);

};

window.onload = Loader;

})();
