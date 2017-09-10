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
    name: 'root',
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
  create: function pile(coins, properties, {left, top}) {
    const numCoins = coins.length;
    const spreadExponent = 0.33; // smaller number causes higher values for smaller coinNumbers relatively speaking
    const spreadFactor = 130; // scales spread in a linear fashion 
    const size = Math.pow(numCoins, spreadExponent) * spreadFactor;
    const property = properties[0];
    const pack = d3_pack()
      .padding(100)
      .size([size, size]);
    const hierarchy = createGroupHierarchy(coins, property);
    const positions = [];
    const labelGroups = [{key: property.key, labels: []}];
    const groups = pack(hierarchy).leaves();
    const maxGroupSize = d3_max(groups, (group) => group.data.coins.length);

    groups.forEach(function(group) {
      group.data.coins.forEach(function(coin) {
        const x = d3_randomNormal(group.x, group.r/3.5)() + left;
        const y = d3_randomNormal(group.y, group.r/3.5)() + top;
        positions.push({x: x, y:y});
        coin.move(x, y);
      });

      labelGroups[0].labels.push({
        value: group.data.key,
        key: property.key,
        x: group.x + left + COIN_HEIGHT/2,
        y: group.y + top + COIN_HEIGHT/2,
        z: group.data.coins.length / maxGroupSize,
        minZoom: 1.1 - group.data.coins.length / maxGroupSize,
        selectable: true,
        alignment: ['center', 'center']
      });
    });
    return {positions, labelGroups, zoom: 'bounds'};
  }
}