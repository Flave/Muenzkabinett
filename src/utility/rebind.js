// Copies a variable number of methods from source to target.
var rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = _rebind(target, source, source[method]);
  return target;
};

function _rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

export default rebind;