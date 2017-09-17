import React from 'react';
import stateStore from 'app/stateStore';

class Ui extends React.Component {

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
            <h3 data-hint='hasClickedLayout' className='ui__section-title'>Layout</h3>
            <LayoutUi state={state} />
          </div>
        </div>
        <FilterUi 
          onFilterRemove={this.handleFilterRemove}
          onClearFilters={this.handleClearFilters}
          onToggleLasso={this.handleToggleLasso}
          onClearLasso={this.handleClearLasso}
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