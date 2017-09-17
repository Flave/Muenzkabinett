import {range as d3_range} from 'd3-array';
import {randomNormal as d3_randomNormal} from 'd3-random';

function createGrouping(coins, propertyOne, propertyTwo) {
  var values = [[], []],
    keys = [propertyOne, propertyTwo],
    groups;

  // Get a list of all the values
  coins.forEach(function(coin) {
    if(values[0].indexOf(coin.data[propertyOne]) === -1)
      values[0].push(coin.data[propertyOne]);
    if(values[1].indexOf(coin.data[propertyTwo]) === -1)
      values[1].push(coin.data[propertyTwo])
  });

  // instantiate a nested array to fill in the coins
  groups = values[0].map(() => { 
    return d3_range(values[1].length).map(() => {
      return [];
    });
  });

  // fill in the coins
  coins.forEach(function(coin) {
    var xIndex = values[0].indexOf(coin.data[keys[0]]),
      yIndex = values[1].indexOf(coin.data[keys[1]]);
    groups[xIndex][yIndex].push(coin);
  });

  groups.sort((groupA, groupB) => {
    var numA = groupA.reduce((acc, coins) => {return acc + coins.length}, 0),
      numB = groupB.reduce((acc, coins) => {return acc + coins.length}, 0);
    return numB - numA;
  });

  // TODO: Sort x group values
  values[0] = groups.map((group) => {
    for(let i=0; i<group.length; i++)
      if(group[i].length)
        return group[i][0].data[propertyOne];
  })

  return {groups: groups, values: values};
}

export default {
  key: 'cluster_grid',
  value: 'Cluster Grid',
  description: 'The coins are grouped by the first property and then split up by second. This results in a grid of categories.',
  requiredTypes: ['discrete', 'discrete'],
  create: function plainGrid(coins, properties, bounds) {
    const propertyOne = properties[0].key;
    const propertyTwo = properties[1].key;
    const SPACING = 550;
    const grouping = createGrouping(coins, propertyOne, propertyTwo);
    const positions = [];
    const labelGroups = [{key: propertyOne, labels: []}, {key: propertyTwo, labels: []}];
    const SPREAD_EXPONENT = 0.24; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const SPREAD_FACTOR = 14; // scales spread in a linear fashion 
    let minY = Infinity;
    let minX = Infinity;
    let x;
    let y;


    grouping.groups.forEach((xGroup, xIndex) => {
      const baseX = SPACING * xIndex + bounds.left;
      xGroup.forEach((yGroup, yIndex) => {
        const spread = Math.pow(yGroup.length, SPREAD_EXPONENT) * SPREAD_FACTOR;
        const baseY = SPACING * yIndex + bounds.top;
        yGroup.forEach((coin) => {
          x = baseX + d3_randomNormal(0, spread)();
          y = baseY + d3_randomNormal(0, spread)();
          positions.push({x, y});
          coin.move(x, y);
          minX = x < minX ? x : minX;
          minY = y < minY ? y : minY;
        });


        if(xIndex === 0)
          labelGroups[1].labels.push({
            key: propertyTwo,
            value: grouping.values[1][yIndex],
            sticky: 'left',
            x: bounds.left,
            y: baseY,
            selectable: true,
            minZoom: yIndex % 2 === 0 ? .12 : .16,
            alignment: ['right', 'center']
          });
      });

      labelGroups[0].labels.push({
        key: propertyOne,
        value: grouping.values[0][xIndex],
        sticky: 'top',
        x: baseX,
        selectable: true,
        minZoom: xIndex % 2 === 0 ? .12 : .16,
        alignment: ['center', 'top']
      });
    });

    labelGroups[0].labels.forEach(label => label.y = minY);
    labelGroups[1].labels.forEach(label => label.x = minX);

    return {
      positions, 
      labelGroups,
      bounds: {left: minX, top: minY, right: minX + 4000, bottom: minY + 4000},
      alignment: ['left', 'top']};
  }
}










