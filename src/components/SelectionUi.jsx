import React from 'react';
import stateStore from 'app/stateStore';

class SelectionUi extends React.Component {

  handleSelectClick() {
    stateStore.set({selecting: !this.props.state.selecting});
  }

  createSelectingButton() {
    var className = 'btn';
    className += this.props.state.selecting ? " is-selected" : "";
    return <div onClick={this.handleSelectClick.bind(this)} className={className}>Select</div>
  }

  render() {
    var state = this.props.state;
    return (
      <div className="selection-ui">
        {this.createSelectingButton()}
      </div>
    );
  }
}

export default SelectionUi;