(function(){
  function myAlerter( num , msg ){
    var alerts = [];
    var j = 7;
    for ( var i=0 ; i<num ; i++ ){
      var curAlerter = (function(i){
        return function() {
          alert(i + " " + msg);
        };
      })(i);
      alerts.push(curAlerter);
    }

    return alerts;
  }

  var alerterSetOne = myAlerter(6 , "Alerting First");
  var alerterSetTwo = myAlerter(10 , "Alerting Second");

  alerterSetOne[4]();
  alerterSetTwo[4]();


})();
