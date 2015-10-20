function alertMsg(){
  console.log("running");
}

function setProperties( curDiv , height , width , content , col ){
  curDiv.style.height = height.toString() + "px";
  curDiv.style.width = width.toString() + "px";
  curDiv.style.color = "blue";
  //curDiv.textContent = content.toString();
  curDiv.style.textAlign = "center";

  curDiv.style.backgroundColor = col;
  curDiv.style.cssFloat = "left";
};

function getNormalizedData(data,curMin,curMax,height){
  //alert(data+" " +curMin+" "+curMax+ " " + height);
  if ( curMin == curMax ) return height;
  return (data)/(curMax) * height;
};

//------------------Displayer Functions--------------------
var Displayer = function (curDiv){
  this.curDiv = curDiv;
};

Displayer.prototype.display = function (nums,height,width,id1,id2) {
  var arrLength = nums.length;
  if ( !arrLength ) return ;
  while ( this.curDiv.firstChild ){
    this.curDiv.removeChild(this.curDiv.firstChild);
  }

  var comWidth = (width)/nums.length;
  var maxVal = Number.MIN_VALUE;
  var minVal = Number.MAX_VALUE;
  var curCol = "black";
  for ( var i=0 ; i<arrLength ; i++ ){
    maxVal = Math.max( maxVal , nums[i] );
    minVal = Math.min( minVal , nums[i] );
  }
  //alert(minVal + " " + arrLength);
  for ( var i=0 ; i<arrLength ; i++ ){
    var newDiv = document.createElement("div");
    var curHeight = getNormalizedData(nums[i],minVal,maxVal,height);
    //alert(curHeight);
    if ( id1 != undefined && (i == id1 || i == id2) ) curCol = "blue";
    else curCol = "black";
    setProperties(newDiv,curHeight,comWidth,nums[i],curCol);
    //alert("Here " + i);
    this.curDiv.appendChild(newDiv);

  }
};

//------------------Sorter Functions--------------------
function Sorter(nums){
  this.nums = nums;
};

Sorter.prototype.BubbleSort = function (resultDiv) {
    var len = this.nums.length;
    var swapped = false;
    var myDisplayer = new Displayer(resultDiv);
    //alert("IN");
    do{
      swapped = false;
      for ( var i=1 ; i<len ; i++ ){
        if ( this.nums[i-1] > this.nums[i] ){
          var tmp = this.nums[i-1];
          this.nums[i-1] = this.nums[i];
          this.nums[i] = tmp;
          swapped = true;

        }
      }
    }while (swapped == true);
};

Sorter.prototype.BubbleSortOneStep = function (resultDiv){
  var len = this.nums.length;
  var running = [];
  var myDisplayer = new Displayer(resultDiv);
  running[0] = false;
  var i;
  for ( i=1 ; i<len ; i++ ){
    if ( this.nums[i-1] <= this.nums[i] ) continue;
    var tmp = this.nums[i-1];
    this.nums[i-1] = this.nums[i];
    this.nums[i] = tmp;
    running[0] = true;
    break;
  }
  //console.log("IN" + " " + i + " " + this.nums[i] + " " + this.nums[i-1]);
  if ( running[0] ){
    myDisplayer.display(this.nums,resultDiv,resultDiv.clientHeight,resultDiv.clientWidth,i,i-1);
  }
  //running[0] = running;
  running[1] = i;
  running[2] = i-1;
  return running;
};

Sorter.prototype.MergeArray = function( left , mid , right ){
  var tmp =[];
  var i = 0,j = 0,k = 0;
  tmp.clear;
  for ( i=left,j=mid+1;i<=mid&&j<=right ; ){
      if ( this.nums[i] < this.nums[j] ) tmp.push ( this.nums[i++]);
      else tmp.push ( this.nums[j++]);
  }
  while ( i <= mid ) tmp.push ( this.nums[i++]);
  while ( j <= right ) tmp.push ( this.nums[j++]);
  for ( i=left,j=0 ; i<=right ; i++,j++ ){
      this.nums[i] = tmp[j];
  }
  return ;
}

Sorter.prototype.MergeSort = function( left , right ){
  //console.log( left + " " + right );
  if ( left == right ) return ;
  var mid = parseInt(  (left+right)/2 );
  this.MergeSort(left,mid);
  this.MergeSort(mid+1,right);
  this.MergeArray(left,mid,right);
  return ;
}


//------------------Main Loader --------------------
var loadFunction = function () {
  var myButton = document.getElementById("myButton");
  var firstInput = document.getElementById("firstInput");
  var htmlBody = document.getElementById("htmlBody");
  var resultDisplay = document.getElementById("sortedResult");
  

  var userData;
  myButton.addEventListener("click",function () {
      userData = firstInput.value.split(" ");
      for ( var i=0 ; i<userData.length ; i++ ){
        userData[i] = +userData[i];

      }

      var mySorter = new Sorter(userData);

      console.log( mySorter.nums );
      //mySorter.BubbleSort(resultDisplay);
      mySorter.MergeSort(0,userData.length -1);
      console.log(mySorter.nums);
      var myDisplayer = new Displayer(resultDisplay);
      myDisplayer.display( mySorter.nums,resultDisplay.clientHeight,resultDisplay.clientWidth);

      //
      // var running = true;
      // console.log("HERE");
      // while ( running  ){
      //   var curVals = mySorter.BubbleSortOneStep(resultDisplay);
      //   running = curVals[0];
      //   //console.log(running + " " + curVals[1] + " " + curVals[2]);
      //   myDisplayer.display( mySorter.nums,resultDisplay.clientHeight,resultDisplay.clientWidth,curVals[1],curVals[2]);
      //
      // }

      //alert(resultDisplay.clientHeight);
      //resultDisplay.alignSelf = "stretch";
      //var myDisplayer = new Displayer(resultDisplay);
      //myDisplayer.display(userData,resultDisplay.clientHeight,resultDisplay.clientWidth );

      //alert(userData);
      // var result = userData;
      // var resultDisplay = document.getElementById("htmlBody");
      // var dis = document.createElement("div");
      // dis.className = "display";
      // dis.style.height = "500px";
      // dis.style.width = "200px";
      // dis.content = result;
      // dis.style.backgroundColor = "black";

    //  resultDisplay.appendChild(dis);
  });

};

window.onload = loadFunction;
