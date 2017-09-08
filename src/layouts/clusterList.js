import {randomNormal as d3_randomNormal} from 'd3-random';
import {getPaddedDimensions, groupDiscrete} from 'app/utility';
import {COIN_HEIGHT} from 'constants';
import {max as d3_max} from 'd3-array';

export default {
  key: 'cluster_list',
  value: 'Cluster List',
  requiredTypes: ['discrete'],
  create: function plainGrid(coins, properties, bounds) {
    const paddedDimensions = getPaddedDimensions(bounds, 0.05);
    const centerY = paddedDimensions.top + paddedDimensions.height/2;
    const propertyKey = properties[0].key;
    const groups = groupDiscrete(coins, propertyKey);
    const positions = [];
    const labelGroups = [{key: propertyKey, labels: []}];
    let lastBounds;
    let x;
    let y;
    const maxGroupSize = d3_max(groups, (group) => group.coins.length);


    groups.forEach(({coins, key}, groupIndex) => {
      let groupBounds = {top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity};
      const lastEnd = groupIndex > 0 ? lastBounds.right : paddedDimensions.left;
      const radius = Math.sqrt(coins.length) * 6;
      const groupX = lastEnd + radius * 2 + 100 + d3_randomNormal(0, 5)();
      const groupY = centerY + d3_randomNormal(0, 5)();

      coins.forEach((coin) => {
        y = d3_randomNormal(groupY, radius/2)() - COIN_HEIGHT/2;
        x = d3_randomNormal(groupX, radius/2)() - COIN_HEIGHT/2;
        positions.push({x, y});
        coin.move(x, y);
        // update bounds for next group positioning
        groupBounds.top = y < groupBounds.top ? y : groupBounds.top;
        groupBounds.left = x < groupBounds.left ? x : groupBounds.left;
        groupBounds.bottom = y > groupBounds.bottom ? y : groupBounds.bottom;
        groupBounds.right = x > groupBounds.right ? x : groupBounds.right;
      });

      // if only few coins in group make position alternate between top/bottom
      const lowCountPos = groupIndex % 2 === 0 ? groupBounds.top - 20 : groupBounds.bottom + COIN_HEIGHT + 20;

      labelGroups[0].labels.push({
        value: key,
        key: propertyKey,
        x: groupX,
        y: coins.length < 12 ? lowCountPos : groupY,
        minZoom: .6 - coins.length / maxGroupSize,
        selectable: true,
        alignment: 'center'
      });

      lastBounds = groupBounds;
    });

    return {positions, labelGroups};
  }
}