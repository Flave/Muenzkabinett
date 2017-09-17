import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {extent as d3_extent} from 'd3-array';

const property2X = d3_scaleLinear();
const property2Y = d3_scaleLinear();

export default {
  key: 'scatter_plot',
  value: 'Scatter Plot',
  requiredTypes: ['continuous', 'continuous'],
  create: function plainGrid(coins, properties, {cx, cy, width, height}) {
    const propertyX =  properties[0].key;
    const propertyY =  properties[1].key;
    const biggerSide = Math.max(width, height);
    const maxSize = 3000;
    const w = width / biggerSide * maxSize;
    const h = height / biggerSide * maxSize;
    const extentX = d3_extent(coins, (coin) => {return coin.data[propertyX]});
    const extentY = d3_extent(coins, (coin) => {return coin.data[propertyY]});
    const labelGroups = [{key: propertyX, labels: []}, {key: propertyY, labels: []}]
    const positions = [];

    property2X.domain(extentX).range([cx - w/2, cx + w/2]);
    property2Y.domain(extentY).range([cy + h/2, cy - h/2]);

    const xTicks = property2X.ticks();
    const yTicks = property2Y.ticks();

    coins.forEach(function(coin) {
      var x = property2X(coin.data[propertyX]),
        y = property2Y(coin.data[propertyY]);

      positions.push({x: x, y: y});
      coin.move(x, y, 1000, Math.random() * 500);
    });


    labelGroups[0].labels = xTicks.map(tick => {
      return {
        key: propertyX,
        value: tick,
        x: property2X(tick),
        y: property2Y.range()[0] + 30,
        alignment: ['right', 'center'],
        sticky: 'bottom'
      }
    });

    labelGroups[1].labels = yTicks.map(tick => {
      return {
        key: propertyY,
        value: tick,
        x: property2X.range()[0] - 30,
        y: property2Y(tick),
        alignment: ['center', 'top'],
        sticky: 'left'
      }
    });
    return {positions, labelGroups};
  }
}