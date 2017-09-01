import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {extent as d3_extent} from 'd3-array';
var property2X = d3_scaleLinear(),
    property2Y = d3_scaleLinear();

function getPaddedBounds(bounds, paddingRatio) {
  var width = bounds.right - bounds.left,
      height = bounds.bottom - bounds.top,
      padding = width * paddingRatio;
  return {left: bounds.left + padding, right: bounds.right - padding, top: bounds.top + padding, bottom: bounds.bottom - padding};
}

export default {
  key: 'scatter_plot',
  value: 'Scatter Plot',
  requiredTypes: ['continuous', 'continuous'],
  create: function plainGrid(coins, properties, bounds) {
    var propertyX =  properties[0].key,
        propertyY =  properties[1].key,
        extentX = d3_extent(coins, (coin) => {return coin.data[propertyX]}),
        extentY = d3_extent(coins, (coin) => {return coin.data[propertyY]}),
        paddedBounds = getPaddedBounds(bounds, 0.03),
        positions = [];

    property2X.domain(extentX).range([paddedBounds.left, paddedBounds.right]);
    property2Y.domain(extentY).range([paddedBounds.bottom, paddedBounds.top]);

    coins.forEach(function(coin, coinIndex) {
      var x = property2X(coin.data[propertyX]),
          y = property2Y(coin.data[propertyY]);

      positions.push({x: x, y: y});
      coin.move(x, y, 1000, Math.random() * 500);
    });
    return {positions};
  }
}