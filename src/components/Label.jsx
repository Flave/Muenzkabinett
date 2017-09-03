import React from 'react';

// {
//   value: <Value to display>,
//   key: <property key the label belongs to>,
//   x: <x position>,
//   y: <y position>,
//   z: <the importance of the label relative to the other labels>,
//   minZoom: <the minimum zoomlevel required to display the label, this is defined in absolute terms independently of the other labels>,
//   selectable: <is label selectable/clickable to filter by it?>,
//   alignment: <alignment of the label defined as {x, y}>
// }

class Label extends React.Component {
  render() {
    const {selectable, alignment, minZoom, x, y, value, onClick, transform} = this.props;
    let className = "label";
    className += selectable ? " label--selectable" : "";
    className += alignment === "center" ? " label--center" : "";
    className += alignment === "right" ? " label--right" : "";

    return (
      <span 
        className={className}
        onClick={() => onClick(value)}
        style={{
          left: `${x * transform.k}px`, 
          top:`${y * transform.k}px`
        }}>
        { value === "" ? "Unknown" : value }
      </span>
    )
  }
}

Label.defaultProps = {
  alignment: 'left',
  minZoom: 0
}

export default Label;