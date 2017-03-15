import {extent as d3_extent} from 'd3-array';
import {range as d3_range} from 'd3-array';
import {max as d3_max} from 'd3-array';
import {randomNormal as d3_randomNormal} from 'd3-random';

var cache = {};

function groupCoins(coins, property) {
  if(cache[property.key]) return cache[property.key];
  var key = property.key,
      extent = d3_extent(coins, function(c, i) { return c.data[key];}),
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

  cache[key] = groups;
  return groups;
}

export default {
  key: 'scatter_line',
  value: 'Scatter Line',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, state, bounds, coinsBounds) {
    var groups = groupCoins(coins, state.selectedProperties[0]),
        paddingRatio = 0.03,
        width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        padding = width * paddingRatio,
        paddedBounds = {left: bounds.left + padding, right: bounds.right - padding*2, top: bounds.top + padding},
        paddedWidth = paddedBounds.right - paddedBounds.left,
        centerX = bounds.left + width/2,
        centerY = bounds.top + height/2,
        spacingX = paddedWidth / groups.length,
        maxGroupLength = d3_max(groups, function(group) {return group.length}),
        maxSpreadY = height,
        spreadX = spacingX/2;
    groups.forEach(function(group, groupIndex) {
      group.forEach(function(coin, coinIndex) {
        var spreadY = (maxSpreadY/maxGroupLength) * group.length * 0.05,
            xOffset = groupIndex * spacingX - d3_randomNormal(coin.width/2, spreadX)() - 5,
            x = paddedBounds.left + xOffset,
            y = centerY + d3_randomNormal(0, spreadY)();
        coin.move(x, y, 1000, Math.random() * 500);
      });
    });
  }
}