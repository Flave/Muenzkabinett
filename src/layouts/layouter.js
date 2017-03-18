import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import layouts from 'utility/layouts';
import coinLayout from 'utility/layouts/coin';

const layouts = [
  import pile from './pile'
]

var layouter = {}

layouter.layouts = layouts;


function isLayoutApplicable(layout, properties) {
  var applicable = false,
      requiredTypes = layout.requiredTypes,
      propertiesCheck = requiredTypes.slice();

  if(layout.requiredTypes.length !== properties.length)
    return false;

  if(properties.length === 0) return true;

  for(var i = 0; i < propertiesCheck.length; i++) {
    // check if property
    var index = propertiesCheck.indexOf(properties[i].type)
    if(index === -1)
      break;
    propertiesCheck[index] = undefined;
    if(i === properties.length-1)
      applicable = true;
  }

  return applicable;
}

function getCoinsBounds(coins) {
  var bounds = {top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity};

  coins.forEach(function(coin) {
    bounds.top = coin.y < bounds.top ? coin.y : bounds.top;
    bounds.right = coin.x > bounds.right ? coin.x : bounds.right;
    bounds.bottom = coin.y > bounds.bottom ? coin.y : bounds.bottom;
    bounds.left = coin.x < bounds.top ? coin.x : bounds.top;
  });
  return bounds;
}

layouter.update = function(coins, state, bounds) {
  console.log('updating layout');
  var layout = _find(layouter.layouts, {key: state.selectedLayout}),
      coinsBounds = getCoinsBounds(coins);
  if(state.selectedCoin !== null)
    coinLayout.create(coins, state, bounds);
  else
    layout.create(coins, state, bounds, coinsBounds);
}

layouter.getApplicableLayouts = function(state) {
  var applicableLayouts = [];

  layouter.layouts.forEach(function(layout) {
    var properties = state.selectedProperties,
        applicable = isLayoutApplicable(layout, properties);
    if(applicable) 
      applicableLayouts.push(layout);
  });
  return applicableLayouts;
}

export default layouter;