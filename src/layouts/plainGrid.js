export default {
  key: 'plain_grid',
  value: 'Plain Grid',
  requiredTypes: ['continuous'],
  create: function plainGrid(coins, properties, bounds) {
    var paddingRatio = 0.03,
        width = bounds.right - bounds.left,
        padding = width * paddingRatio,
        paddedBounds = {left: bounds.left + padding, right: bounds.right - padding*2, top: bounds.top + padding},
        newCoinPositions = [];

    coins.sort(function(a, b) {
      return a.data[properties[0].key] - b.data[properties[0].key];
    });

    var x = paddedBounds.left,
        yIndex = 0,
        y = 0;
    coins.forEach(function(coin, i) {
      if(x > paddedBounds.right) {
        x = paddedBounds.left;
        yIndex++;
      }
      y = yIndex * 40 + paddedBounds.top;

      coin.move(x, y, 1000, Math.random() * 500);
      newCoinPositions.push({x: x, y: y});
      x += coin.width;
    });
    return newCoinPositions;
  }
}