import React from 'react';
import {createLabelData} from 'utility';
import _find from 'lodash/find';
import coinProperties from 'constants/coinProperties';

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
    const {
      isPreselected, 
      selectable, 
      propertyKey, 
      alignment, 
      x, 
      y, 
      value: rawValue, 
      onClick, 
      transform} = this.props;

    const propSpec = _find(coinProperties, {key: propertyKey});
    const {value, unit, modifiers} = createLabelData(propSpec, rawValue);
    let className = 'label';
    className += selectable ? ' label--selectable' : '';
    className += alignment[0] === 'center' ? ' label--center-x' : '';
    className += alignment[0] === 'right' ? ' label--right' : '';
    className += alignment[1] === 'center' ? ' label--center-y' : '';
    className += isPreselected ? ' is-preselected' : '';
    className += modifiers ? ` label--${modifiers[0]}` : '';

    return (
      <span 
        className={className}
        onClick={(e) => selectable && onClick(value, e)}
        style={{
          left: `${x * transform.k}px`, 
          top:`${y * transform.k}px`
        }}>
        {value} {unit}
      </span>
    )
  }
}

Label.defaultProps = {
  alignment: 'left',
  minZoom: 0
}

export default Label;