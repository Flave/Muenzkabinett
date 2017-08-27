import React from 'react';

class SelectionUi extends React.Component {
  render() {
    var {labels, transform} = this.props;
    if(!labels || !labels.length) return <div/>;

    return (
      <div className="labels">
        {labels.map((label, i) => (
          <span 
            key={i}
            className="label"
            style={{
              position: "absolute",
              left: `${label.x * transform.k}px`, 
              top:`${label.y * transform.k}px`
            }}>
            {label.value}
          </span>
        ))}
      </div>
    );
  }
}

export default SelectionUi;