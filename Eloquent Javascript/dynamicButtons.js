//-------------Helper functions-------------
var createButton = function( buttonName , height , width ){
  var curButton = document.createElement("button");
  curButton.style.height = height.toString() + "px";
  curButton.style.width = width.toString() + "px";
  curButton.textContent = buttonName;
  return curButton;
};



//-------------Loader function-------------
var loaderFunction = function(){
  var htmlBody = document.getElementById("htmlBody");
  var buttons = [];
  var numOfButtons = 10;
  for ( var i=1 ; i<=numOfButtons ; i++){
    buttons.push("button"+i.toString());
  }

  console.log(buttons);
  var createdButtons = [];
  for ( var i=0;i<buttons.length ; i++){
    var curButton = createButton(buttons[i],100,100);
    console.log(curButton);
    var createAddButtonListener = function (myButton, additionalText) {
      console.log(additionalText);
        return function( myButton ){
          console.log(myButton);
          // myButton.addEventListener("click",function(){
          //     alert(myButton.textContent);
          // });
          // myButton.addEventListener("click",function(){
              alert(this.textContent + " " + myButton.x);
          // });
        };
    };


    curButton.onclick = createAddButtonListener(curButton, ":(");
    console.log(curButton.onclick);
    htmlBody.appendChild( curButton );
    createdButtons.push( curButton );
  }

};

// var add5 = function (number) {
// return number + 5;
// }
//
// var makeAdder = function (addOffset) {
//   return function (number) {
//     return number + offset;
//   };
// }
//
// var adder5 = makeAdder (5);
// var adder7 makeAdder (7);


window.onload = loaderFunction;
