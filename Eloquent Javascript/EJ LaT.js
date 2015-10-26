(function(){

    var Loader = function( ){
      var mainString = "#######";
      var stringLength = mainString.length;
      for (var i=0 ; i<stringLength ; i++ ){
        console.log(mainString.substr(stringLength-i-1));
      }


    };



    window.onload = Loader;
})();
