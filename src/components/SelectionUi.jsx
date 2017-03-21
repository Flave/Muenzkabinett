import React from 'react';
import stateStore from 'app/stateStore';

class SelectionUi extends React.Component {

  createSelectingButton() {
    var className = 'btn';
    className += this.props.state.selecting ? " is-selected" : "";
    return <span onClick={this.handleSelectClick.bind(this)} className={className}>Select</span>
  }

  createClearButton() {
    return <span onClick={this.handleClearClick.bind(this)} className="btn">Clear Selection</span>
  }

  handleSelectClick() {
    stateStore.set({selecting: !this.props.state.selecting});
  }

  handleClearClick() {
    stateStore.set({selectedCoins: []});
  }

  render() {
    var state = this.props.state;
    return (
      <div className="selection-ui">
        {this.createSelectingButton()}
        {(state.selectedCoins.length > 0) && this.createClearButton()}
      </div>
    );
  }
}

export default SelectionUi;