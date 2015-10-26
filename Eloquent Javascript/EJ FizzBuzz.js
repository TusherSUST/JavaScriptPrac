(function(){

    var divisibleMaker = function (a){
      return function (b){
        return (b%a) == 0;
      };
    }

    var Loader = function( ){

      var divisibleBy5 = divisibleMaker(5);
      var divisibleBy3 = divisibleMaker(3);

      for ( var i=1 ; i<=100 ; i++ ){
          if ( divisibleBy3(i) && divisibleBy5(i) ) console.log("FizzBuzz");
          else if ( divisibleBy3(i) ) console.log("Fizz");
          else if ( divisibleBy5(i) ) console.log("Buzz");
          else console.log(i);
      }
    };

    window.onload = Loader;
})();
