var createElement = function ( name , className ) {
  var element = document.createElement( name );
  if ( className ) element.className = className;
  return element;
};

var DOMDisplay = function ( parent , level ){
  this.wrap = parent.appendChild ( createElement( "div" , "game" ) );
  this.level = level;

  this.wrap.appendChild ( this.drawBackground( ) );
  this.actorLayer = null;
  this.drawFrame( );
};

var scale = 20;

DOMDisplay.prototype.drawBackground = function ( ) {
  var table = createElement ( "table" , "background" );
  table.style.width = this.level.width * scale + "px";

  this.level.grid.forEach ( function ( row ) {
    var rowElement = table.appendChild ( createElement( "tr" ) );
    rowElement.style.height = scale + "px";
    row.forEach ( function ( type ) {
      rowElement.appendChild( createElement( "td" , type ) );
    });
  });

  return table;
};

DOMDisplay.prototype.drawActors = function ( ) {
  var wrap = createElement ( "div" );
  this.level.actors.forEach ( function ( actor ) {
    var rect = wrap.appendChild( createElement("div" , "actor " + actor.type) );
    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  return wrap;
};

DOMDisplay.prototype.drawFrame = function ( ) {
  if ( this.actorLayer )
    this.wrap.removeChild ( this.actorLayer );
  this.actorLayer = this.wrap.appendChild( this.drawActors() );
  this.wrap.className = "game" + (this.level.status || "" );
  this.scrollPlayerIntoView( );
};

DOMDisplay.prototype.scrollPlayerIntoView = function ( ) {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = (width/2);

  var left = this.wrap.scrollLeft  , right = left + width;
  var top = this.wrap.scrollTop , bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus ( player.size.times (0.5) ).times (scale);
  // console.log ( center.x + " " + left + " " + margin );
  if ( center.x < left + margin ){
    this.wrap.scrollLeft = center.x - margin;
  }
  else if ( center.x > right - margin ){
    this.wrap.scrollLeft = center.x + margin - width;
  }
  else if ( center.y < top + margin ){
    this.wrap.scrollTop = center.y - margin;
  }
  else if ( center.y > bottom - margin ){
    this.wrap.scrollTop = center.y + margin - height;
  }


};

DOMDisplay.prototype.clear = function ( ){
  this.wrap.parentNode.removeChild( this.wrap );
};
