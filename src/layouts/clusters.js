import {hierarchy as d3_hierarchy} from 'd3-hierarchy';
import {max as d3_max} from 'd3-array';
import {pack as d3_pack} from 'd3-hierarchy';
import {randomNormal as d3_randomNormal} from 'd3-random';
import {groupDiscrete} from 'utility';
import {COIN_HEIGHT} from 'constants';

function createGroupHierarchy(coins, property) {
  var groups = groupDiscrete(coins, property.key);
  var children = []
  groups.forEach(function(group) {
    children.push({
        key: group.key,
        coins: group.coins
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
    const labelGroups = [{key: property.key, labels: []}];
    const groups = pack(hierarchy).leaves();
    const maxGroupSize = d3_max(groups, (group) => group.data.coins.length);

    groups.forEach(function(group, i) {
      group.data.coins.forEach(function(coin, i) {
        var x = d3_randomNormal(group.x, group.r/3.5)() + bounds.left,
            y = d3_randomNormal(group.y, group.r/3.5)() + bounds.top;
        positions.push({x: x, y:y});
        coin.move(x, y);
      });

      labelGroups[0].labels.push({
        value: group.data.key,
        key: property.key,
        x: group.x + bounds.left + COIN_HEIGHT/2,
        y: group.y + bounds.top + COIN_HEIGHT/2,
        z: group.data.coins.length / maxGroupSize,
        minZoom: 1.1 - group.data.coins.length / maxGroupSize,
        selectable: true,
        alignment: 'center'
      });
    });
    return {positions, labelGroups};
  }
}