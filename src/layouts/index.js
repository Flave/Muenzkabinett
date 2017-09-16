import _find from 'lodash/find';
import {removeFalsy} from 'app/utility';

import pile from './pile';
import scatterLine from './scatterLine';
import plainGrid from './plainGrid';
import scatterPlot from './scatterPlot';
import clusters from './clusters';
import scatterLines from './scatterLines';
import clusterGrid from './clusterGrid';
import clusterList from './clusterList';
import nestedGrid from './nestedGrid';

import coinLayout from './coin';
import notSelected from './notSelected';
import introLayout from './intro';

const layouts = [
  pile,
  scatterLine,
  plainGrid,
  scatterPlot,
  clusters,
  clusterGrid,
  clusterList,
  scatterLines,
  nestedGrid
]

var layouter = {};

// Checks whether a specific layout is applicable for the selected properties
// I guess there's a less complicated way to do this
function isLayoutApplicable(layout, selectedProperties) {
  var applicable = false,
    requiredTypes = layout.requiredTypes,
    propertiesCheck = requiredTypes.slice(),
    properties = [];

  // lazily create a new array only containing the layouts that are defined
  selectedProperties[0] && properties.push(selectedProperties[0]);
  selectedProperties[1] && properties.push(selectedProperties[1]);

  // if no properties are selected but properties are required, return false
  if(layout.requiredTypes.length !== properties.length)
    return false;

  // no types are required and no properties are selected, return true
  if(properties.length === 0) return true;

  for(var i = 0; i < propertiesCheck.length; i++) {
    var index = propertiesCheck.indexOf(properties[i].type)
    if(index === -1)
      break;
    propertiesCheck[index] = undefined;
    if(i === properties.length-1)
      applicable = true;
  }

  return applicable;
}



layouter.getLayouts = function() {
  return layouts;
}

/*
  Returns the default layout for the given selected properties. If there is 
  already a layout selected check if it is still applicable. If not, return first applicable layout.
*/
layouter.getApplicableLayout = function(state) {
  let selectedLayout = _find(layouts, {key: state.selectedLayout});
  let applicableLayouts = layouter.getApplicableLayouts(state.selectedProperties);

  if(isLayoutApplicable(selectedLayout, state.selectedProperties))
    return selectedLayout;

  return applicableLayouts[0];
}


/*
  Returns a list of applicable layouts given a set of selected properties
*/
layouter.getApplicableLayouts = function(properties) {
  var applicableLayouts = [];

  layouts.forEach(function(layout) {
    var applicable = isLayoutApplicable(layout, properties);
    if(applicable) 
      applicableLayouts.push(layout);
  });
  return applicableLayouts;
}

layouter.intro = function(coins, bounds) {
  return introLayout.create(coins, bounds);
}

layouter.update = function(selectedCoins, notSelectedCoins, state, canvasBounds) {
  var layout = _find(layouts, {key: state.selectedLayout}),
    properties = removeFalsy(state.selectedProperties),
    layoutSpec;

  if(state.selectedCoin !== null) {
    layoutSpec = coinLayout.create(selectedCoins, state.selectedCoin, canvasBounds, {width: state.width, height: state.height});
  } else {
    layoutSpec = layout.create(selectedCoins, properties, canvasBounds, state);
  }
  return layoutSpec;
}

layouter.updateNotSelected = function(notSelectedCoins, coinsBounds, canvasBounds, state) {
  notSelectedCoins.length && notSelected.create(notSelectedCoins, coinsBounds, canvasBounds, state.selectedCoin);
}

export default layouter;

