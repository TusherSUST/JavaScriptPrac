// var http = require('http');
var https = require('https');
var fs = require('fs');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {

  host: 'uva.onlinejudge.org',
  path: '/external/1/101.pdf',
  // host: 'www.random.org',
  // path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
};

var file = fs.createWriteStream ( 'downloads/101.pdf');

callback = function(response) {
  var str = '';
  // console.log ( response );
  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    // str += chunk;
    file.write ( chunk );
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
    file.end();
  });
}

https.request(options, callback).end();
console.log ("done");
