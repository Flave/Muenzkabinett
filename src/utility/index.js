import {range as d3_range} from 'd3-array';
import {extent as d3_extent} from 'd3-array';
import _find from 'lodash/find';

export function getPaddedDimensions(bounds, paddingRatio) {
  var width = bounds.right - bounds.left,
      height = bounds.bottom - bounds.top,
      padding = width * paddingRatio,
      left = bounds.left + padding, 
      right = bounds.right - padding, 
      top = bounds.top + padding, 
      bottom = bounds.bottom - padding;

  return {
    left: left,
    right: right,
    top: top,
    bottom: bottom,
    width: right - left,
    height: bottom - top,
    padding: padding
  };
}

export function getExtent(coins, key) {
  return d3_extent(coins, (c, i) => { return c.data[key]; });
}

export function removeFalsy(array) {
  return array.filter(function(v) { return !!v; });
}

export function groupContinuous(coins, property, extent) {
  var key = property.key,
      bins = d3_range(extent[0], extent[1], property.grouping),
      groups = bins.map(function(stepIndex) {
      var coinsInStep = [];
      coins.forEach(function(coin) {
        var floored = Math.floor(coin.data[key])
        if(floored >= stepIndex && floored <= (stepIndex + property.grouping))
          coinsInStep.push(coin);
      });
    return coinsInStep;
  });
  return groups;
}

export function groupDiscrete(coins, key) {
  var values = [],
      groups;
  coins.forEach((coin, i) => {
    if(values.indexOf(coin.data[key]) === -1)
      values.push(coin.data[key]);
  });

  groups = d3_range(values.length).map(() => {
    return [];
  });

  coins.forEach((coin, i) => {
    var value = coin.data[key];
    groups[values.indexOf(value)].push(coin);
  });

  groups.sort((groupA, groupB) => { return groupB.length - groupA.length; });
  return groups;
}

export function getDiscreteProperty(properties) {
  return _find(properties, {type: 'discrete'});
}

export function getContinuousProperty(properties) {
  return _find(properties, {type: 'continuous'});
}