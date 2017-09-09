import {sum as d3_sum} from 'd3-array';
import {randomNormal as d3_randomNormal} from 'd3-random';
import _forEach from 'lodash/forEach';
import Victor from 'victor';
import coinProperties from 'constants/coinProperties';
import {getCoinsBounds} from 'utility';
import {COIN_HEIGHT} from 'constants';

function getSimilarity(selectedCoin, coin) {
  var similarity = {properties: [], value: 0};
  _forEach(coinProperties, function(property) {
    if(selectedCoin.data[property.key] === coin.data[property.key]) {
      similarity.value += property.similarityWeight;
      similarity.properties.push({key: property.key, value: coin.data[property.key]});
    }
  });
  return similarity;
}

export default {
  create: function(coins, selectedCoin, {width}) {
    const {cx, cy} = getCoinsBounds(coins);
    const maxDelta = {x: 0, y: 0};
    const baseRadius = 1000;
    const innerBelt = 300;
    const maxSimilarity = d3_sum(coinProperties, function(property) {return property.similarityWeight;});
    const similarityWidth = baseRadius - innerBelt;
    const positions = [];
    let x; 
    let y;

    // update selected coin
    x = cx - selectedCoin.width/2;
    y = cy;
    positions.push({x, y});
    selectedCoin.move(x, y);

    coins.forEach(function(coin) {
      if(coin.data.id === selectedCoin.data.id) return;
      else {
        const similarity = getSimilarity(selectedCoin, coin);
        const similarityOffset = similarity.value / maxSimilarity * similarityWidth - d3_randomNormal(0, 30)();
        const radiusScatter = Math.abs(d3_randomNormal(0, 300)()) + baseRadius - d3_randomNormal(0, 20)();
        const radius = similarity.properties.length ? (baseRadius - similarityOffset) : radiusScatter;
        const delta = new Victor(coin.x - cx, coin.y - cy);

        delta.normalize().multiply(new Victor(radius, radius))
        x = cx + delta.x;
        y = cy + delta.y;

        maxDelta.x = Math.abs(delta.x) > maxDelta.x ? Math.abs(delta.x) : maxDelta.x;
        maxDelta.y = Math.abs(delta.y) > maxDelta.y ? Math.abs(delta.y) : maxDelta.y;
      }

      positions.push({x, y});
      coin.move(x, y);
    });

    // calculate next bounds with selected coin in center
    const nextBounds = {
      top: cy - maxDelta.y,
      bottom: cy + maxDelta.y + COIN_HEIGHT,
      left: cx - maxDelta.x,
      right: cx + maxDelta.x + COIN_HEIGHT
    }

    return {positions, bounds: nextBounds};
  }
}