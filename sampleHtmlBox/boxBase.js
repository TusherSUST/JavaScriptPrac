var boxBase = (function ( ){
  var box = function( x , y , height , width , direction ) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 50;
    this.height = height || 50;
    this.direction = direction || 0;
  };


  box.prototype.setXY = function ( x , y ){
    this.x = x;
    this.y = y;
  };

  box.prototype.draw = function ( context ){
    context.fillStyle = "#FF0000";
    context.fillRect ( this.x , this.y , this.width , this.height );
  };

  box.prototype.eraseBox = function ( context ){
    context.fillStyle = "#FFFFFF";
    context.fillRect ( this.x , this.y , this.width , this.height );
  };

  return {
    box : box
  };

})();
