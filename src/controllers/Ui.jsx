import React from 'react';
import OrderingUi from 'components/OrderingUi';
import LayoutUi from 'components/LayoutUi';
import FilterUi from 'components/FilterUi';
import _find from 'lodash/find';

import stateStore from 'app/stateStore';

class Ui extends React.Component {
  constructor(props) {
    super(props);
    this.handleClearFilters = this.handleClearFilters.bind(this);
    this.handleFilterRemove = this.handleFilterRemove.bind(this);
  }

  handleFilterRemove({key, value}) {
    let {coinFilters} = stateStore.get();
    const filter = _find(coinFilters, {key, value});
    const index = coinFilters.indexOf(filter);
    coinFilters.splice(index, 1);
    stateStore.set({coinFilters});
  }

  handleClearFilters() {
    stateStore.set({coinFilters: []});
  }

  handleDeselectCoin() {
    stateStore.set({selectedCoin: null});
  }

  render() {
    var state = stateStore.get();

    return (
      <div className='ui'>
        <div className='ui__left'>
          <div className='ui__section ui__section--divider'>
            <h3 className='ui__section-title'>Order by</h3>
            <OrderingUi state={state}/>
          </div>
          <div className='ui__section'>
            <h3 className='ui__section-title'>Layout</h3>
            <LayoutUi state={state} />
          </div>
        </div>
        <FilterUi 
          onFilterRemove={this.handleFilterRemove}
          onClearFilters={this.handleClearFilters}
          onDeselectCoin={this.handleDeselectCoin}
          selecting={state.selecting}
          selectedCoins={state.selectedCoins}
          selectedCoin={state.selectedCoin}
          filters={state.coinFilters}/>
      </div>
    );
  }
}

export default Ui;