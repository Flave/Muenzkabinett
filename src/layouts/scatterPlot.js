import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {extent as d3_extent} from 'd3-array';
import {COIN_HEIGHT} from 'constants';

const property2X = d3_scaleLinear();
const property2Y = d3_scaleLinear();

export default {
  key: 'scatter_plot',
  value: 'Scatter Plot',
  description: 'A regular old scatter plot where the position (x and y) is defined by two numerical properties.',
  requiredTypes: ['continuous', 'continuous'],
  create: function plainGrid(coins, properties, {cx, cy, width, height}) {
    const propertyX =  properties[0].key;
    const propertyY =  properties[1].key;
    const biggerSide = Math.max(width, height);
    const maxSize = 4000;
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
      const x = property2X(coin.data[propertyX]) - COIN_HEIGHT/2;
      const y = property2Y(coin.data[propertyY]) - COIN_HEIGHT/2;

      positions.push({x: x, y: y});
      coin.move(x, y, 1000, Math.random() * 500);
    });


    labelGroups[0].labels = xTicks.map((tick, i) => {
      return {
        key: propertyX,
        value: tick,
        x: property2X(tick),
        y: property2Y.range()[0] + 30,
        alignment: ['center', 'top'],
        sticky: 'bottom',
        minZoom: i % 2 === 0 ? .1 : .2,
      }
    });

    labelGroups[1].labels = yTicks.map((tick, i) => {
      return {
        key: propertyY,
        value: tick,
        x: property2X.range()[0] - 30,
        y: property2Y(tick),
        alignment: ['right', 'center'],
        sticky: 'left',
        minZoom: i % 2 === 0 ? .1 : .2,
      }
    });
    return {positions, labelGroups};
  }
}