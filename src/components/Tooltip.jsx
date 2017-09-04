import React, { Component } from 'react';
import { removeFalsy } from 'utility';

class Tooltip extends Component {

  componentDidUpdate() {
    this.updateDimensions();
  }

  componentDidMount() {
    this.updateDimensions();
  }

  updateDimensions() {
    const {root, tip} = this;
    const {offset, coin, transform} = this.props;
    const width = root.clientWidth;
    const height = root.clientHeight;
    const x = (coin.position.x + 20) * transform.k;
    const y = (coin.position.y + 20) * transform.k;
    // TODO: make y position depend on the bottom position of the tip
    const yOffset = offset.y * transform.k < 20 ? 20 : offset.y * transform.k;

    root.style.left = `${x - width / 2}px`;
    root.style.top = `${y - height - yOffset}px`;
    tip.style.left = `${x - 7}px`;
    tip.style.top = `${y - yOffset - 9}px`;
  }

  render() {
    const {properties, transform, coin, modifiers, offset} = this.props;
    const modifierClasses = modifiers.map(modifier => `tooltip--${modifier}`).join(" ");
    const setProperties = removeFalsy(properties);
    let className = `tooltip ${modifierClasses}`;
    className += setProperties.length ? "tooltip--has-properties" : "";

    return  (
      <div className={className} ref={root => this.root = root}>
        <div ref={el => this.tip = el} className="tooltip__tip"/>
        <div className="tooltip__title">{coin.data.title}</div>
        {setProperties.map((prop, i) =>
          <div className="tooltip__prop" key={i}>
            <i className={`tooltip__prop-icon icon-${prop.key}`}></i>
            <div className="tooltip__prop-label">{prop.label}</div>
            <div className="tooltip__prop-value">{coin.data[prop.key] ? coin.data[prop.key] : "Unknown"}{prop.unit}</div>
          </div>
        )}
      </div>
    )
  }
}

Tooltip.defaultProps = {
  modifiers: [],
  offset: {x: 30, y: 30}
}

export default Tooltip;