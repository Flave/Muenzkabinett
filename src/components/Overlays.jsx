import React from 'react';

class SelectionUi extends React.Component {
  render() {
    var {transform} = this.props;

    return (
      <div className="overlays">
        <div 
          style={{transform: `translate(${transform.x}px, ${transform.y}px)`}} 
          className="overlays__inner">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default SelectionUi;