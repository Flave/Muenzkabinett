import {max as d3_max} from 'd3-array';
import {COIN_HEIGHT} from 'constants';
import {getDiscreteProperty, getContinuousProperty, groupDiscrete} from 'app/utility';

const groupSorter = (key) =>
  (coinA, coinB) =>
    coinA.data[key] - coinB.data[key]

const createGrid = (coins) => {
  const numCols = Math.ceil(Math.sqrt(coins.length));
  const PADDING = 10;
  const SPACING = COIN_HEIGHT + PADDING;
  const width = numCols * SPACING;
  let rowIndex = 0;
  let lastCoinWidth = 0;
  let lastCoinX = 0;
  const positions = [];
  
  coins.map((coin) => {
    const xOffset = lastCoinX + lastCoinWidth + PADDING;
    const newRow = (xOffset + coin.width) > width;
    newRow && rowIndex++;
    const x = newRow ? 0 : xOffset;
    const y = rowIndex * SPACING;
    positions.push({x, y});
    lastCoinWidth = coin.width;
    lastCoinX = x;
  });

  return {positions, width, height: (rowIndex + 1) * SPACING}
}

export default {
  key: 'nested_grid',
  value: 'Nested Grid',
  description: 'The coins are grouped into categories, sorted by the numerical category and placed in a grid.',
  requiredTypes: ['discrete', 'continuous'],
  create: function plainGrid(coins, properties, {left, top}) {
    const continuousProperty = getContinuousProperty(properties);
    const discreteProperty = getDiscreteProperty(properties);
    const groups = groupDiscrete(coins, discreteProperty.key);
    const sorter = groupSorter(continuousProperty.key);
    const PADDING = 60;
    const SHOW_TOP_N = 4;
    const visibleBounds = {top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity};
    let lastGroupEnd = left;
    const maxGroupSize = d3_max(groups, (group) => group.coins.length);
    const positions = [];
    const labelGroups = [{key: discreteProperty.key, labels: []}];    

    groups.forEach((group, groupIndex) => {
      group.coins.sort(sorter);
      const numCoins = group.coins.length;
      const {width, height, positions: groupPositions} = createGrid(group.coins);
      const groupX = lastGroupEnd + PADDING + COIN_HEIGHT/2;
      const labelX = groupX + width/2;
      const labelY = numCoins < 10 ? top - 40 : top + height/2;
      let labelMinZoom = .4 - numCoins / maxGroupSize;

      labelGroups[0].labels.push({
        value: group.key,
        key: discreteProperty.key,
        x: labelX,
        y: labelY,
        minZoom: labelMinZoom,
        selectable: true,
        alignment: ['center', 'center']
      });

      group.coins.forEach((coin, i) => {
        const position = groupPositions[i];
        const x = groupX + position.x;
        const y = top + position.y;

        if(groupIndex < SHOW_TOP_N) {
          visibleBounds.top = y < visibleBounds.top ? y : visibleBounds.top;
          visibleBounds.left = x < visibleBounds.left ? x : visibleBounds.left;
          visibleBounds.right = x > visibleBounds.right ? x : visibleBounds.right;
          visibleBounds.bottom = y > visibleBounds.bottom ? y : visibleBounds.bottom;
        }

        positions.push({x, y});
        coin.move(x, y);
      });
      lastGroupEnd = groupX + width;
    });

    return {
      positions, 
      labelGroups, 
      bounds: visibleBounds
    };
  }
}