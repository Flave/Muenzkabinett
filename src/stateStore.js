import {dispatch as d3_dispatch} from 'd3-dispatch';
import layouter from 'app/layouts';
import rebind from 'utility/rebind';
import _cloneDeep from 'lodash/cloneDeep';
import _assign from 'lodash/assign';
import _find from 'lodash/find';

var _state = {
  selectedProperties: [],
  selectedLayout: _find(layouter.getLayouts(), {key: 'pile'}),
  selectedCoin: null,
  coinsProgress: 0,
  onboardingState: 0
};

var _prevState = {};

var dispatch = d3_dispatch('change');
var stateStore = {};

var setters = {
  selectedProperties: function(oldProp, newProp, key) {
    if(newProp.length > 2)
      newProp.shift();

    _state[key] = newProp;
    var applicableLayouts = layouter.getApplicableLayouts(_state);
    _state.selectedLayout = applicableLayouts[0].key;
  }
}

stateStore.get = function() {
  return _state;
}

stateStore.getPrevious = function() {
  return _prevState;
}

stateStore.set = function(key, value, update) {
  _prevState = _state;
  if(setters[key] !== undefined)
    setters[key](_state[key], value, key);
  else
    _state[key] = value;
  if(update !== false)
    dispatch.call('change', _state, key);
}

stateStore.set = function(newProps, update) {
  _prevState = _state;
  _state = _assign({}, _cloneDeep(_state), newProps);
  if(update !== false)
    dispatch.call('change', _state, _prevState);
}

export default rebind(stateStore, dispatch, 'on');