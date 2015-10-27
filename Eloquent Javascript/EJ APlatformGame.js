(function(){
  var simpleLevelPlan = [
                          "                    ",
                          "                    ",
                          " x              = x " ,
                          " x        o o     x " ,
                          " x @     xxxxx    x " ,
                          " xxxxx            x " ,
                          "     x!!!!!!!!!!!!x " ,
                          "     xxxxxxxxxxxxxx " ,
                          "                    "
                          ];
  var loader = function (){
    // console.log("loaded");
    // var simpleLevel = new Level( simpleLevelPlan );
    // // console.log( simpleLevel );
    // var htmlBody = document.getElementById("htmlBody");
    // var display = new Display ( htmlBody , simpleLevel );
    // console.log( display.wrap );
    // console.log ( GAME_LEVELS[0] );
    //console.log ( GAME_LEVELS[0].length + " " + GAME_LEVELS[0][0].length );
    runGame ( GAME_LEVELS , DOMDisplay );
  };


  window.onload = loader;
})();
