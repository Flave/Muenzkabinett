import {pack as d3_pack} from 'd3-hierarchy';
import {hierarchy as d3_hierarchy} from 'd3-hierarchy';
import {randomNormal as d3_randomNormal} from 'd3-random';
import _groupBy from 'lodash/groupBy';
import _forEach from 'lodash/forEach';

var cache = {};


function createGroupHierarchy(coins, property) {
  if(cache[property.key]) return cache[property.key];
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
  cache[property.key] = hierarchy;
  return hierarchy;
}

export default {
  key: 'clusters',
  value: 'Clusters',
  requiredTypes: ['discrete'],
  create: function pile(coins, state, bounds, coinsBounds) {
    var width = bounds.right - bounds.left,
        height = bounds.bottom - bounds.top,
        property = state.selectedProperties[0],
        pack = d3_pack()
          .size([width, height]),
        hierarchy = createGroupHierarchy(coins, property);

    pack(hierarchy).leaves().forEach(function(group, i) {
      group.data.coins.forEach(function(coin, i) {
        var x = d3_randomNormal(group.x, width/55)() + bounds.left,
            y = d3_randomNormal(group.y, width/55)() + bounds.top;
        coin.move(x, y);
      })
    });
  }
}