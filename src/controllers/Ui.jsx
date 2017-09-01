import React from 'react';
import OrderingUi from 'components/OrderingUi';
import LayoutUi from 'components/LayoutUi';
import SelectionUi from 'components/SelectionUi';

import stateStore from 'app/stateStore';

class Ui extends React.Component {
  render() {
    var state = stateStore.get();

    return (
      <div className="ui">
        <div className="ui__section">
          <h3 className="ui__section-title">
            <span className="ui__section-number">1</span>
            Order by
          </h3>
          <OrderingUi state={state}/>
        </div>
        <div className="icon-arrow_right ui__arrow"></div>
        <div className="ui__section ui__section--divider">
          <h3 className="ui__section-title">
            <span className="ui__section-number">2</span>
            Layout
          </h3>
          <LayoutUi state={state} />
        </div>
        <div className="ui__section">
          <SelectionUi state={state} />
        </div>
      </div>
    );
  }
}

export default Ui;