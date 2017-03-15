var coins = [];

var coinsStore = {};

coinsStore.get = function() {
  return coins;
}

coinsStore.set = function(data) {
  coins = data;
}

coinsStore.add = function(coin) {
  coins.push(coin);
}

export default coinsStore;