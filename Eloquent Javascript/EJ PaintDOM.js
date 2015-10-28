function createElement ( name , attributes ){
  var curNode = document.createElement(name);
  if ( attributes ){
    for ( var i in attributes ){
      if ( attributes.hasOwnProperty( i ) )
        curNode.setAttribut( i , attributes[i] );
    }
  }

  for ( var i=2 ; i<arguments.length ; i++ ){
    var curChild = arguments[i];
    if ( typeof curChild == "string" )
      curChild = document.createTextNode( curChild );
    curNode.appendChild ( curChild );
  }
  return curNode;
};
