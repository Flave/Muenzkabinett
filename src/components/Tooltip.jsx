import React, { Component } from 'react';
import { removeFalsy } from 'utility';

class Tooltip extends Component {
  // componentDidMount() {
  //   let { transform, coin, offset } = this.props;
  //   let { root, tip } = this;
  //   const x = coin.position.x * transform.k;
  //   const y = coin.position.y * transform.k;
  //   let sideSpec = this.getSide(x, y);
  //   let className = `tooltip--${sideSpec.side}`;
  //   let top, left, tipTop, tipLeft;

  //   switch(sideSpec.side) {
  //     case 'top':
  //       top = y - offset.y - sideSpec.height;
  //       left = x - sideSpec.width / 2;
  //       tipTop = y - offset.y - 8;
  //       tipLeft = x - 6;
  //       break;
  //     case 'bottom':
  //       top = y + offset.y;
  //       left = x - (sideSpec.width / 2);
  //       tipTop = y + offset.y - 6;
  //       tipLeft = x - 6;
  //       break;
  //     case 'right':
  //       top = y - sideSpec.height/2;
  //       left = x + offset.x;
  //       tipTop = y - 6;
  //       tipLeft = x + offset.x - 6;
  //       break;
  //     case 'left':
  //       top = y - sideSpec.height/2;
  //       left = x - sideSpec.width - offset.x;
  //       tipTop = y - 6;
  //       tipLeft = x - offset.x - 8;
  //       break;
  //     default:
  //       break;
  //   }

  //   tip.style.top = `${Math.floor(tipTop)}px`;
  //   tip.style.left = `${Math.floor(tipLeft)}px`;

  //   root.style.top = `${Math.floor(top)}px`;
  //   root.style.left = `${Math.floor(left)}px`;
  //   root.style.width = Math.floor(sideSpec.width / 2) * 2 + "px";
  //   root.classList.add(className);
  // }

  // getSide(x, y) {
  //   let { offset } = this.props;
  //   let { root } = this;
  //   let windowHeight = window.innerHeight;
  //   let windowWidth = window.innerWidth;
  //   let width = root.clientWidth;
  //   let height = root.clientHeight;
  //   let top = y - height;
  //   let bottom = y + height;
  //   let right = x + width;
  //   let side = null;
  //   let yShift = 0;
  //   let xShift = 0;
  //   let padding = 20;

  //   // Get general direction
  //   if(top - offset.y > padding)
  //     side = 'top'
  //   if(top - offset.y < padding)
  //     side = 'bottom';
  //   if(side === 'bottom' && (bottom + offset.y) > windowHeight - padding)
  //     side = 'right';
  //   if(side === 'right' && (right + offset.x) > windowWidth - padding)
  //     side = 'left';

  //   // get shift if tooltip doesn't fit
  //   // if tooltip sticks out at the bottom
  //   if(side === 'right' || side === 'left')
  //     yShift = windowHeight - (bottom - height/2)
  //   // if is at top or bottom but tooltip sticks out to the left
  //   else if(x - width/2 < 0)
  //     xShift = Math.abs(x - width/2)
  //   // if tooltip is at top or bottom but sticks out to the right
  //   else if(x + width/2 > windowWidth)
  //     xShift = windowWidth - (x + width/2)

  //   return {width, height, side, xShift, yShift}
  // }

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
            <div className="tooltip__prop-value">{coin.data[prop.key]}{prop.unit}</div>
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