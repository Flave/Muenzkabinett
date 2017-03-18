import React from 'react';
import OrderingUi from 'components/OrderingUi';
import LayoutUi from 'components/LayoutUi';

import stateStore from 'app/stateStore';

class Ui extends React.Component {
  render() {
    var state = stateStore.get();

    return (
      <div className="ui is-visible">
        <div className="ui__section">
          <h3 className="ui__section-title">Order Coins by&hellip;</h3>
          <OrderingUi state={state}/>
        </div>
        <div className="ui__section">
          <h3 className="ui__section-title">Possible Layouts</h3>
          <LayoutUi state={state} />
        </div>
      </div>
    );
  }
}

export default Ui;