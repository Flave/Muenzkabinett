import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {extent as d3_extent} from 'd3-array';

const property2X = d3_scaleLinear();
const property2Y = d3_scaleLinear();

function getPaddedBounds(bounds, paddingRatio) {
  const width = bounds.right - bounds.left;
  const padding = width * paddingRatio;
  return {left: bounds.left + padding, right: bounds.right - padding, top: bounds.top + padding, bottom: bounds.bottom - padding};
}

export default {
  key: 'scatter_plot',
  value: 'Scatter Plot',
  requiredTypes: ['continuous', 'continuous'],
  create: function plainGrid(coins, properties, bounds) {
    const propertyX =  properties[0].key;
    const propertyY =  properties[1].key;
    const extentX = d3_extent(coins, (coin) => {return coin.data[propertyX]});
    const extentY = d3_extent(coins, (coin) => {return coin.data[propertyY]});
    const paddedBounds = getPaddedBounds(bounds, 0.03);
    const positions = [];

    property2X.domain(extentX).range([paddedBounds.left, paddedBounds.right]);
    property2Y.domain(extentY).range([paddedBounds.bottom, paddedBounds.top]);

    coins.forEach(function(coin) {
      var x = property2X(coin.data[propertyX]),
        y = property2Y(coin.data[propertyY]);

      positions.push({x: x, y: y});
      coin.move(x, y, 1000, Math.random() * 500);
    });
    return {positions};
  }
}