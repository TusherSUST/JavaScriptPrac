//------------------Red Black Tree-------------------
function RedBlackTree(nodeValue,nodeColor,par,leftChild,rightChild){
  this.nodeValue = nodeValue;
  this.nodeColor = nodeColor;
  this.par = par;
  this.leftChild = leftChild;
  this.rightChild = rightChild;
};

var treeRoot;
var debugDiv;

//----------------Simple Functions-------------------
RedBlackTree.prototype.getParent = function( ){
  return this.par;
};

RedBlackTree.prototype.getGrandParent = function( ){
  if ( this.par != undefined ) return this.par.getParent(  );
  return undefined;
};

RedBlackTree.prototype.getUncle = function( ){
  var grandParent = this.getGrandParent();
  if ( grandParent == undefined ) return undefined;
  if ( this.par == grandParent.leftChild ) return grandParent.rightChild;
  else return grandParent.leftChild;
};

RedBlackTree.prototype.getSibling = function( ){
  if ( this == this.par.leftChild ) return this.par.rightChild;
  return this.par.leftChild;
};

RedBlackTree.prototype.rotateLeft = function (){
//  console.log("Rotating Left");
  var curNode = this;
  var curPar = this.par;
  var grandParent = curPar.par;

  curPar.rightChild = curNode.leftChild;
  if ( curPar.rightChild != undefined ) curPar.rightChild.par = curPar;

  curNode.par = grandParent;
  if ( grandParent == undefined ) treeRoot = curNode;
  else if ( curPar == grandParent.leftChild ) grandParent.leftChild = curNode;
  else grandParent.rightChild = curNode;

  curNode.leftChild = curPar;
  curPar.par = curNode;
};

RedBlackTree.prototype.rotateRight = function (){
  //console.log("Rotating Right");
  var curNode = this;
  var curPar = this.par;
  var grandParent = curPar.par;

  curPar.leftChild = curNode.rightChild;
  if ( curPar.leftChild != undefined ) curPar.leftChild.par = curPar;

  curNode.par = grandParent;
  if ( grandParent == undefined ) treeRoot = curNode;
  else if ( curPar == grandParent.leftChild ) grandParent.leftChild = curNode;
  else grandParent.rightChild = curNode;

  curNode.rightChild = curPar;
  curPar.par = curNode;
};

//-------------------Insertion Functions--------------------
RedBlackTree.prototype.insertCaseOne = function (){
  console.log("Case 1");
  if ( this.par == undefined ) {
    treeRoot = this;
    this.nodeColor = "black";
  }
  else this.insertCaseTwo();
};

RedBlackTree.prototype.insertCaseTwo = function (){
  console.log("Case 2");
  if ( this.par.nodeColor == "black" ) {
    return ;
  }
  else this.insertCaseThree();
};

RedBlackTree.prototype.insertCaseThree = function (){
  console.log("Case 3");
  var uncle = this.getUncle();
  var grandParent = this.getGrandParent();

  if ( uncle != undefined && uncle.nodeColor == "red"){
    console.log("IN");
    this.par.nodeColor = "black";
    uncle.nodeColor = "black";
    grandParent.nodeColor = "red";
    grandParent.insertCaseOne();
  }
  else this.insertCaseFour();
};

RedBlackTree.prototype.insertCaseFour = function(){
  console.log("Case 4");

  var grandParent = this.getGrandParent();
  var nxtCall = this;
  if ( this == this.par.rightChild && this.par == grandParent.leftChild){
    this.rotateLeft();
    nxtCall = this.leftChild;
  }
  else if ( this == this.par.leftChild && this.par == grandParent.rightChild) {
    this.rotateRight();
    nxtCall = this.rightChild;
  }
  nxtCall.insertCaseFive();
};

RedBlackTree.prototype.insertCaseFive = function(){
  console.log("Case 5");
  var grandParent = this.getGrandParent();
  this.par.nodeColor = "black";
  grandParent.nodeColor = "red";
  if ( this == this.par.leftChild ) this.par.rotateRight();
  else this.par.rotateLeft();
};

RedBlackTree.prototype.insertANode = function ( curNode ){
  if ( curNode == undefined || curNode.nodeValue == -1 ) {
    this.insertCaseOne();
  }
  else if ( curNode.nodeValue >= this.nodeValue ){
    if ( curNode.leftChild == undefined ){
      curNode.leftChild = this;
      this.par = curNode;
      this.insertCaseOne();
    }
    else this.insertANode( curNode.leftChild );
  }
  else if ( curNode.nodeValue < this.nodeValue ){
    if ( curNode.rightChild == undefined ){
      curNode.rightChild = this;
      this.par = curNode;
      this.insertCaseOne();
    }
    else this.insertANode( curNode.rightChild );
  }
}

//-------------------Displayer Functions--------------
function Displayer(myCanvas,boxHeight,boxWidth){
  this.myCanvas = myCanvas;
  this.canvasHeight = myCanvas.height;
  this.canvasWidth = myCanvas.width;
  this.boxHeight = boxHeight;
  this.boxWidth = boxWidth;
  this.halfBoxHeight = parseInt(boxHeight/2);
  this.halfBoxWidth = parseInt(boxWidth/2);
};

Displayer.prototype.drawTree = function( curNode , curX , curY , treeLvl){
  //console.log(this);
  var context = this.myCanvas.getContext("2d");
  context.fillStyle = (curNode.nodeColor == "red")?"#FF0000":"#000000";
  context.fillRect(curX,curY,this.boxHeight,this.boxWidth);
  context.fillStyle = "#001AFF";
  context.font = "20px Arial";
  context.fillText(curNode.nodeValue.toString(),curX+this.halfBoxHeight-5,curY+this.halfBoxWidth+5);

  if ( curNode.leftChild != undefined ){
    var nxtX = parseInt(curX-this.boxWidth*treeLvl);
    var nxtY = parseInt(curY+this.boxHeight*treeLvl);

    context.beginPath();
    context.moveTo(curX,curY+ this.boxHeight);
    context.lineTo(nxtX+this.boxWidth,nxtY);
    context.stroke();

    this.drawTree( curNode.leftChild,nxtX,nxtY,treeLvl-1);
  }
  if ( curNode.rightChild != undefined ){
    var nxtX = parseInt( curX + this.boxWidth*treeLvl);
    var nxtY = parseInt( curY + this.boxHeight*treeLvl);

    context.beginPath();
    context.moveTo(curX+this.boxWidth,curY+ this.boxHeight);
    context.lineTo(nxtX,nxtY);
    context.stroke();

    this.drawTree(curNode.rightChild,nxtX,nxtY,treeLvl-1);
  }
};

Displayer.prototype.display = function(curRoot){
  var curX = parseInt(this.canvasWidth/2) - this.halfBoxWidth;
  var curY = 10;
  var context = this.myCanvas.getContext("2d");
  context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
  this.drawTree(curRoot,curX,curY,4);
  // var context = this.myCanvas.getContext("2d");
  // context.strokeRect(0,0,100,100);
};



//-------------------Main Loader---------------------
var loaderFunction = function(){
  var submitButton = document.getElementById("myButton");
  var inputField = document.getElementById("firstInput");
  //debugDiv = document.getElementById("debug");
  var myCanvas = document.getElementById("myCanvas");

  var userData;
  var myDisplayer = new Displayer(myCanvas,40,40);
  submitButton.addEventListener("click",function(){
    userData = parseInt(inputField.value);
  //  console.log(treeRoot);
    var curNode = new RedBlackTree( userData , "red");
    curNode.insertANode(treeRoot);
    console.log(treeRoot);


    myDisplayer.display(treeRoot);
  });



  // var p = new RedBlackTree(1);
  // var q = new RedBlackTree(2);
  // var a = new RedBlackTree(3);
  // var b = new RedBlackTree(4);
  // var c = new RedBlackTree(5);
  //
  // p.rightChild = q;
  // q.par = p;
  //
  // p.leftChild = a;
  // a.par = p;
  //
  // q.leftChild = b;
  // b.par = q;
  // q.rightChild = c;
  // c.par = q;
  //
  // treeRoot = p;
  // //console.log(p);
  // q.rotateLeft();
  // p.rotateRight();
  // console.log(treeRoot);

};

window.onload = loaderFunction;
