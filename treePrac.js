(function(){
//------------------Red Black Tree-------------------

//Constructor For a Node in Red Black Tree
function RedBlackTree(nodeValue,nodeColor,par,leftChild,rightChild){
  this.nodeValue = nodeValue;
  this.nodeColor = nodeColor;
  this.par = par;
  this.leftChild = leftChild;
  this.rightChild = rightChild;
};

//Tracks the root of the tree
var treeRoot;

//----------------Simple Functions-------------------

//Returns the Grand Parent of a node
RedBlackTree.prototype.getGrandParent = function( ){
  if ( this.par != undefined ) return this.par.par;
  return undefined;
};

//Returns the Uncle (Sibling of Parent) of a node
RedBlackTree.prototype.getUncle = function( ){
  var grandParent = this.getGrandParent();
  if ( grandParent == undefined ) return undefined;
  if ( this.par == grandParent.leftChild ) return grandParent.rightChild;
  else return grandParent.leftChild;
};

//Rotates a node left
//From ( A , B , (C , D , E) )
//TO ( ( A , B , C ) , D , E )
//Called Using Node 'D'
RedBlackTree.prototype.rotateLeft = function (){
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

//Rotates a node right
//From ( ( A , B , C ) , D , E )
//TO ( A , B , (C , D , E) )
//Called Using Node 'D'
RedBlackTree.prototype.rotateRight = function (){
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

//Insertion Case One - Root Node
RedBlackTree.prototype.insertCaseOne = function (){
  if ( this.par == undefined ) {
    treeRoot = this;
    this.nodeColor = "black";
  }
  else this.insertCaseTwo();
};

//Insertion Case Two - Current Node's Parent is BLACK
RedBlackTree.prototype.insertCaseTwo = function (){
  if ( this.par.nodeColor == "black" ) {
    return ;
  }
  else this.insertCaseThree();
};

//Insertion Case Three - Current Node's Parent and Uncle are both RED
RedBlackTree.prototype.insertCaseThree = function (){
  var uncle = this.getUncle();
  var grandParent = this.getGrandParent();

  if ( uncle != undefined && uncle.nodeColor == "red"){
    this.par.nodeColor = "black";
    uncle.nodeColor = "black";
    grandParent.nodeColor = "red";
    grandParent.insertCaseOne();
  }
  else this.insertCaseFour();
};

//Insertion Case Four - Node is added to right of left child of grandparent,
//                      or Node is added to left of right child of grandparent
//                      (Parent is red and Uncle is black)
RedBlackTree.prototype.insertCaseFour = function(){
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

//Insertion Case Five - Node is added to left of left child of grandparent,
//                      or Node is added to right of right child of grandparent
//                      (Parent is red and Uncle is black)
RedBlackTree.prototype.insertCaseFive = function(){
  var grandParent = this.getGrandParent();
  this.par.nodeColor = "black";
  grandParent.nodeColor = "red";
  if ( this == this.par.leftChild ) this.par.rotateRight();
  else this.par.rotateLeft();
};

//Traverses the already built tree to find a place for the new Node
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

//Displayer Constructor
function Displayer(myCanvas,boxHeight,boxWidth){
  this.myCanvas = myCanvas;

  this.canvasHeight = myCanvas.height;
  this.canvasWidth = myCanvas.width;

  this.boxHeight = boxHeight;
  this.boxWidth = boxWidth;

  this.halfBoxHeight = parseInt(boxHeight/2);
  this.halfBoxWidth = parseInt(boxWidth/2);
};

//Draws A Node
Displayer.prototype.drawNode = function(curNode,curX,curY){
  var context = this.myCanvas.getContext("2d");
  context.fillStyle = (curNode.nodeColor == "red")?"#FF0000":"#000000";
  context.fillRect(curX,curY,this.boxHeight,this.boxWidth);
  context.fillStyle = "#001AFF";
  context.font = "20px Arial";
  context.fillText(curNode.nodeValue.toString(),curX+this.halfBoxHeight-5,curY+this.halfBoxWidth+5);
};

//Draws A line from (curX,curY) to (nxtX,nxtY)
Displayer.prototype.drawLine = function(curX,curY,nxtX,nxtY){
  var context = this.myCanvas.getContext("2d");
  context.beginPath();
  context.moveTo(curX,curY);
  context.lineTo(nxtX,nxtY);
  context.stroke();
}

//Traverses the tree
Displayer.prototype.drawTree = function( curNode , curX , curY , treeLvl){
  this.drawNode(curNode,curX,curY);

  if ( curNode.leftChild != undefined ){
    var nxtX = parseInt(curX-this.boxWidth*treeLvl);
    var nxtY = parseInt(curY+this.boxHeight*treeLvl);

    this.drawLine(curX,curY+this.boxHeight,nxtX+this.boxWidth,nxtY);

    this.drawTree( curNode.leftChild,nxtX,nxtY,treeLvl-1);
  }
  if ( curNode.rightChild != undefined ){
    var nxtX = parseInt( curX + this.boxWidth*treeLvl);
    var nxtY = parseInt( curY + this.boxHeight*treeLvl);

    this.drawLine( curX+this.boxWidth,curY+this.boxHeight,nxtX,nxtY);

    this.drawTree(curNode.rightChild,nxtX,nxtY,treeLvl-1);
  }
};

//Starter function
Displayer.prototype.display = function(curRoot){
  var curX = parseInt(this.canvasWidth/2) - this.halfBoxWidth;
  var curY = 10;
  var context = this.myCanvas.getContext("2d");
  context.clearRect(0,0,this.canvasWidth,this.canvasHeight);
  this.drawTree(curRoot,curX,curY,4);
};

//-------------------Main Loader---------------------
var loaderFunction = function(){
  var submitButton = document.getElementById("myButton");
  var inputField = document.getElementById("firstInput");
  var myCanvas = document.getElementById("myCanvas");

  var userData;
  var myDisplayer = new Displayer(myCanvas,40,40);
  submitButton.addEventListener("click",function(){
    userData = parseInt(inputField.value);
    var curNode = new RedBlackTree( userData , "red");
    curNode.insertANode(treeRoot);

    myDisplayer.display(treeRoot);
  });
};

window.onload = loaderFunction;
})();
