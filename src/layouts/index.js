import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import coinProperties from 'constants/coinProperties';

import pile from './pile';
import scatterLine from './scatterLine';
import plainGrid from './plainGrid';
import scatterPlot from './scatterPlot';
import clusters from './clusters';

import coinLayout from './coin';
import introLayout from './intro';

const layouts = [
  pile,
  scatterLine,
  plainGrid,
  scatterPlot,
  clusters,
  {
    key: 'cluster_list',
    value: 'Clusters List',
    requiredTypes: ['discrete'],
    create: function pile(coins, size) {
      coins.forEach(function(coin, i) {
        var x = d3.randomNormal(size.width/2, 100)();
        var y = d3.randomNormal(size.height/2, 100)();
        coin.move({x:x, y:y});
      });
    }
  },
  {
    key: 'cluster_grid',
    value: 'Clusters Grid',
    requiredTypes: ['discrete', 'discrete']
  },
  {
    key: 'scatter_lines',
    value: 'Scatter Lines',
    requiredTypes: ['discrete', 'continuous']
  },
  {
    key: 'nested_grid',
    value: 'Nested Grid',
    requiredTypes: ['discrete', 'continuous']
  }
]

var layouter = {}


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

layouter.getLayouts = function() {
  return layouts;
}

layouter.update = function(coins, state, bounds) {
  var layout = _find(layouts, {key: state.selectedLayout}),
      coinsBounds = getCoinsBounds(coins);

/*  if(state.onboardingState === 0) {
    introLayout.create(coins, state, bounds, coinsBounds);
  }*/

  if(state.selectedCoin !== null)
    coinLayout.create(coins, state, bounds);
  else
    layout.create(coins, state, bounds, coinsBounds);

}

layouter.getApplicableLayout = function(state) {
  var selectedLayout = _find(layouts, {key: state.selectedLayout}),
      applicableLayouts = layouter.getApplicableLayouts(state.selectedProperties);

  if(isLayoutApplicable(selectedLayout, state.selectedProperties))
    return selectedLayout.key;

  return applicableLayouts[0].key;
}

layouter.getApplicableLayouts = function(properties) {
  var applicableLayouts = [];

  layouts.forEach(function(layout) {
    var applicable = isLayoutApplicable(layout, properties);
    if(applicable) 
      applicableLayouts.push(layout);
  });
  return applicableLayouts;
}

export default layouter;