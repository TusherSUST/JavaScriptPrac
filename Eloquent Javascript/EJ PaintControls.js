function relativePosition ( event , element ){
  var rect = element.getBoundingClientRect( );
  return { x : Math.floor( event.clientX - rect.left ) ,
           y : Math.floor( event.clientY - rect.top  ) };
};

function trackDrag ( onMove , onEnd ){
  function end ( event ){
    removeEventListener ( "mousemove" , onMove );
    removeEventListener ( "mouseup" , end );
    if ( onEnd )
      onEnd ( event );
  }
  addEventListener ( "mousemove" , onMove );
  addEventListener ( "mouseup" , end );
};

function loadImageURL ( context , url ){
  var image = document.createElement ( "img" );
  image.addEventListener ( "load" , function ( ) {
    var color = context.fillStyle , size = context.lineWidth;
    context.canvas.width = image.width;
    context.canvas.height = image.height;
    context.drawImage ( image , 0 , 0 );
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = size;
  });
  image.src = url;
};

var controls = Object.create(null);
var tools = Object.create(null);

function createPaint ( parent ) {
  var canvas = createElement ( "canvas" , {width:500,height:400} );
  var context = canvas.getContext("2d");

  var toolBar = createElement ( "div" , { class : "toolbar" } );

  for ( var name in controls )
    toolBar.appendChild( controls[name](context) );

  var panel = createElement ( "div" , {class : "picturepanel" } , canvas );
  parent.appendChild ( createElement( "div" , null , panel , toolBar ) );
};

controls.tool = function ( context ){
  var select = createElement( "select" );
  for ( var name in tools )
    select.appendChild ( createElement( "option" , null , name ) );

  context.canvas.addEventListener( "mousedown" , function(event){
    if ( event.which == 1 ){
      tools[select.value]( event , context );
      event.preventDefault();
    }
  });

  return createElement ( "span" , null , "Tool: " , select );
};

controls.color = function ( context ){
  var input = createElement("input" , {type:"color"} );
  input.addEventListener ( "change" , function( ){
    context.fillStyle = input.value;
    context.strokeStyle = input.value;
  });

  return createElement ( "span" , null , "Color: " , input );
};

controls.brushSize = function ( context ){
  var select = createElement ( "select" );
  var sizes = [ 1 , 2 , 3 , 5 , 8 , 12 , 25 , 35 , 50 , 75 , 100 ];
  sizes.forEach ( function( size ) {
    select.appendChild ( createElement ("option" , {value:size} , size + " pixels" ) );
  });

  select.addEventListener ( "change" , function( ) {
    context.lineWidth = select.value;
  });
  return createElement ( "span" , null , "Brush Size : " , select );
};

controls.save = function ( context ){
  var link = createElement ( "a" , { href : "/" } , "Save" );
  function update(){
    try {
      link.href = context.canvas.toDataUrl();
    }
    catch ( e ) {
      if ( e instanceof SecurityError )
        link.href = "javascript:alert( " + JSON.stringify ( "Can't save: " + e.toString() + " )" );
      else
        throw e;
    }
  }

  link.addEventListener ( "mouseover" , update );
  link.addEventListener ( "focus" , update );

  return link;
};

tools.line = function ( event , context , onEnd ){
  context.lineCap = "round";

  var pos = relativePosition ( event , context.canvas );

  trackDrag ( function(event) ){
    context.beginPath();
    context.moveTo ( pos.x , pos.y );
    pos = relativePosition ( event , context.canvas );
    context.lineTo ( pos.x , pos.y );
    context.stroke();
  }, onEnd );
};

tools.erase = function ( event , context ){
  context.globalCompositeOperation = "destination-out";
  tools.line ( event , context , function( ){
    context.globalCompositeOperation = "source-over";
  });
};
