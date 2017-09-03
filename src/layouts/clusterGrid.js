import {range as d3_range} from 'd3-array';
import {scaleLinear as d3_scaleLinear} from 'd3-scale';
import {randomNormal as d3_randomNormal} from 'd3-random';
import {getPaddedDimensions} from 'app/utility';

var property2X = d3_scaleLinear(),
    property2Y = d3_scaleLinear();

function createGrouping(coins, propertyOne, propertyTwo) {
  var values = [[], []],
      keys = [propertyOne, propertyTwo],
      groups;

  // Get a list of all the values
  coins.forEach(function(coin, coinIndex) {
    if(values[0].indexOf(coin.data[propertyOne]) === -1)
      values[0].push(coin.data[propertyOne]);
    if(values[1].indexOf(coin.data[propertyTwo]) === -1)
      values[1].push(coin.data[propertyTwo])
  });


  if(values[0].length < values[1].length) {
    values.reverse();
    keys.reverse();
  }

  // instantiate a nested array to fill in the coins
  groups = values[0].map((xValue) => { 
    return d3_range(values[1].length).map(() => {
      return [];
    });
  });

  // fill in the coins
  coins.forEach(function(coin, coinIndex) {
    var xIndex = values[0].indexOf(coin.data[keys[0]]),
        yIndex = values[1].indexOf(coin.data[keys[1]]);
    groups[xIndex][yIndex].push(coin);
  });

  groups.sort((groupA, groupB) => {
    var numA = groupA.reduce((acc, coins) => {return acc + coins.length}, 0),
        numB = groupB.reduce((acc, coins) => {return acc + coins.length}, 0);
    return numB - numA;
  });

  return {groups: groups, values: values};
}

export default {
  key: 'cluster_grid',
  value: 'Cluster Grid',
  requiredTypes: ['discrete', 'discrete'],
  create: function plainGrid(coins, properties, bounds) {
    const paddedDimensions = getPaddedDimensions(bounds, 0.05);
    const propertyOne = properties[0].key;
    const propertyTwo = properties[1].key;
    const showTop = 20;
    const grouping = createGrouping(coins, propertyOne, propertyTwo);
    const xSpacing = paddedDimensions.width / showTop;
    const ySpacing = paddedDimensions.height / showTop;
    const positions = [];
    const labels = [];

    grouping.groups.forEach((xGroup, xIndex) => {
      xGroup.forEach((yGroup, yIndex) => {
        var spread = Math.sqrt(yGroup.length) * (paddedDimensions.width / 5000);
        yGroup.forEach((coin, coinIndex) => {
          var x, y;
          if(xIndex < showTop && yIndex < showTop) {
            x = xSpacing * xIndex + bounds.left + paddedDimensions.padding + d3_randomNormal(0, spread)();
            y = ySpacing * yIndex + bounds.top + paddedDimensions.padding + d3_randomNormal(0, spread)();
          } else {
            x = bounds.left + 20;
            y = bounds.bottom + 20;
          }
          positions.push({x: x, y:y});
          coin.move(x, y, 1000, Math.random() * 500);
        })
      });
    });

    return {positions, labels};
  }
}