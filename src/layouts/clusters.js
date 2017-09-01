import {hierarchy as d3_hierarchy} from 'd3-hierarchy';
import {max as d3_max} from 'd3-array';
import {pack as d3_pack} from 'd3-hierarchy';
import {randomNormal as d3_randomNormal} from 'd3-random';
import _groupBy from 'lodash/groupBy';
import _forEach from 'lodash/forEach';

function createGroupHierarchy(coins, property) {
  var groups = _groupBy(coins, function(coin, i) {
    return coin.data[property.key]
  });

  var children = []
  _forEach(groups, function(group, key) {
    children.push({
        name: key,
        coins: group
      });
  })

  var hierarchy = {
    name: "root",
    children: children
  }

  hierarchy = d3_hierarchy(hierarchy)
    .sum(function(group) { 
      return group.coins ? group.coins.length : 1; 
    });
  return hierarchy;
}

export default {
  key: 'clusters',
  value: 'Clusters',
  requiredTypes: ['discrete'],
  create: function pile(coins, properties, bounds) {
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const property = properties[0];
    const pack = d3_pack()
       .padding(100)
       .size([width, height]);
    const hierarchy = createGroupHierarchy(coins, property);
    const positions = [];
    const labels = [];
    const groups = pack(hierarchy).leaves();
    const maxGroupSize = d3_max(groups, (group) => group.data.coins.length);

    groups.forEach(function(group, i) {
      group.data.coins.forEach(function(coin, i) {
        var x = d3_randomNormal(group.x, group.r/3.5)() + bounds.left,
            y = d3_randomNormal(group.y, group.r/3.5)() + bounds.top;
        positions.push({x: x, y:y});
        coin.move(x, y);
      });

      labels.push({
        value: group.data.name,
        key: property.key,
        x: group.x + bounds.left,
        y: group.y + bounds.top,
        minZoom: 1.1 - group.data.coins.length / maxGroupSize,
        z: group.data.coins.length / maxGroupSize,
        selectable: true
      });
    });
    return {positions, labels};
  }
}