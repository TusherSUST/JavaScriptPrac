// Action Types
var actionTypes = Object.create(null);

actionTypes.grow = function ( creep ) {
  // console.log("called");
  creep.energy += 2;
  return true ;
};

actionTypes.move = function ( creep , point , action ){
  // console.log("movin");
  var destination = this.getDestination ( action , point );
  if ( destination == null || creep.energy <= 1
      || this.grid.getValueAt( destination ) != null ){
        return false;
  }
  creep.energy -= 1;
  this.grid.setValueAt ( point , null );
  this.grid.setValueAt ( destination , creep );
  return true;
};

actionTypes.eat = function ( creep , point , action ){
  var destination = this.getDestination ( action , point );
  var atDestination = (destination != null) && this.grid.getValueAt ( destination );
  if ( !atDestination ||  atDestination.energy == null ){
        return false;
  }
  creep.energy += atDestination.energy;
  this.grid.setValueAt ( destination , null );
  return true;
};

actionTypes.reproduce = function ( creep , point , action ){
  var baby = elementFromChar ( this.legend , creep.originalChar );
  console.log( baby );
  var destination = this.getDestination ( action , point );
  if ( destination == null || creep.energy <= 2 * baby.energy
       || this.grid.getValueAt( destination ) != null ) {
    return false;
  }
  creep.energy -= 2 * baby.energy;
  this.grid.setValueAt ( destination , baby );
  return true;
};
