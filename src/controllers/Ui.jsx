import React from 'react';
import TagList from 'components/TagList';
import LayoutList from 'components/LayoutList';

import stateStore from 'app/stateStore';

class Ui extends React.Component {
  render() {
    var state = stateStore.get();

    return (
      <div className="ui is-visible">
        <div className="ui__section">
          <h3 className="ui__section-title">Coin Properties</h3>
          <TagList state={state}/>
        </div>
        <div className="ui__section">
          <h3 className="ui__section-title">Layouts</h3>
          <LayoutList state={state} />
        </div>
      </div>
    );
  }
}

export default Ui;