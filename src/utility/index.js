import {range as d3_range} from 'd3-array';
import {extent as d3_extent} from 'd3-array';
import _find from 'lodash/find';
import _every from 'lodash/every';

export function getPaddedDimensions(bounds, padding) {
  if(typeof padding !== 'object')
    padding = {left: padding, right: padding, bottom: padding, top: padding};
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const left = padding.left < 1 ? bounds.left + width * padding.left : bounds.left + padding.left;
  const right = padding.right < 1 ? bounds.right - width * padding.right : bounds.right - padding.right;
  const top = padding.top < 1 ? bounds.top + height * padding.top : bounds.top + padding.top;
  const bottom = padding.bottom < 1 ? bounds.bottom - height * padding.bottom : bounds.bottom - padding.bottom;

  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    padding: padding.left * width
  };
}

export function getExtent(coins, key) {
  return d3_extent(coins, (c) => { return c.data[key]; });
}

export function removeFalsy(array) {
  return array.filter(function(v) { return !!v; });
}

export function groupContinuous(coins, property, extent) {
  const key = property.key;
  const bins = d3_range(extent[0], extent[1], property.grouping);
  return bins.map(function(stepIndex) {
    var coinsInStep = [];
    coins.forEach(function(coin) {
      var floored = Math.floor(coin.data[key])
      if(floored >= stepIndex && floored < (stepIndex + property.grouping))
        coinsInStep.push(coin);
    });
    return coinsInStep;
  });
}

export function groupDiscrete(coins, key) {
  var values = [],
    groups;
  // Collect all the possible values
  coins.forEach((coin) => {
    if(values.indexOf(coin.data[key]) === -1)
      values.push(coin.data[key]);
  });

  groups = values.map((value) => ({coins: [], key: value}));

  coins.forEach((coin) => {
    var value = coin.data[key];
    groups[values.indexOf(value)].coins.push(coin);
  });

  groups.sort((groupA, groupB) => { return groupB.coins.length - groupA.coins.length; });
  return groups;
}

export function getDiscreteProperty(properties) {
  return _find(properties, {type: 'discrete'});
}

export function getContinuousProperty(properties) {
  return _find(properties, {type: 'continuous'});
}

export function getCoinsBounds(coins) {
  var bounds = {top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity};
  coins.forEach(function(coin) {
    bounds.top = coin.y < bounds.top ? coin.y : bounds.top;
    bounds.right = coin.x > bounds.right ? coin.x : bounds.right;
    bounds.bottom = coin.y > bounds.bottom ? coin.y : bounds.bottom;
    bounds.left = coin.x < bounds.left ? coin.x : bounds.left;
  });
  bounds.dx = bounds.right - bounds.left;
  bounds.dy = bounds.bottom - bounds.top;
  bounds.cx = bounds.left + (bounds.right - bounds.left) / 2;
  bounds.cy = bounds.top + (bounds.bottom - bounds.top) / 2;
  return bounds;
}

export function filterCoins(coins, filters, selection) {
  const selected = [];
  const notSelected = [];
  const groupedFilters = [];
  filters.forEach(({key, value}) => {
    const group = _find(groupedFilters, {key: key});
    if(group)
      group.values.push(value);
    else
      groupedFilters.push({key: key, values: [value]})
  });

  coins.forEach((coin) => {
    let isFiltered = _every(groupedFilters, ({key, values}) =>
      values.indexOf(coin.data[key]) > -1
    )
    // check if there is a selection and if coin is part of it
    let isSelected = selection.length ? selection.indexOf(coin) > -1 : true;
    if(isFiltered && isSelected)
      selected.push(coin);
    else
      notSelected.push(coin);
  });
  return {selected, notSelected};
}

export const getCanvasArea = (bounds) => {
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;

  return {
    area: width * height,
    width,
    height
  }
}









