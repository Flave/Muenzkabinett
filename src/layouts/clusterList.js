import {randomNormal as d3_randomNormal} from 'd3-random';
import {getPaddedDimensions, groupDiscrete} from 'app/utility';

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
    let lastBounds;
    let groupBounds = {top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity};
    let x;
    let y;


    groups.forEach((group, groupIndex) => {
      const lastEnd = groupIndex > 0 ? lastBounds.right : paddedDimensions.left;
      const radius = Math.sqrt(group.coins.length) * 6;
      const groupX = lastEnd + radius * 2 + 50 + d3_randomNormal(0, 5)();
      const groupY = centerY + d3_randomNormal(0, 5)();

      group.coins.forEach((coin, i) => {
        y = d3_randomNormal(groupY, radius/2)();
        x = d3_randomNormal(groupX, radius/2)();
        positions.push({x, y});
        coin.move(x, y, 1000, Math.random() * 500);
        // update bounds for next group positioning
        groupBounds.top = y < groupBounds.top ? y : groupBounds.top;
        groupBounds.left = x < groupBounds.left ? x : groupBounds.left;
        groupBounds.bottom = y > groupBounds.bottom ? y : groupBounds.bottom;
        groupBounds.right = x > groupBounds.right ? x : groupBounds.right;
      });
      lastBounds = groupBounds;
    });

    return {positions};
  }
}