import React from 'react';
import stateStore from 'app/stateStore';
import hints from 'constants/hints';

class Hints extends React.Component {
  componentDidUpdate() {
    const {hintStep} = stateStore.get();
    const target = document.querySelectorAll(`[data-hint="${hints[hintStep].key}"]`)[0];
    const {root} = this;
    if(target) {
      const {width, height} = stateStore.get();
      const targetBbox = target.getBoundingClientRect();
      const bbox = root.getBoundingClientRect();

      root.style.top = `${targetBbox.top - bbox.height - 30}px`;
      root.style.left = `${targetBbox.left + targetBbox.width / 2 - bbox.width/2}px`;
      if(this.props.showHints)
        root.classList.remove('is-hidden');
    } else {
      root.classList.add('is-hidden');
    }
  }
  render() {
    const {hintStep, showHints} = this.props;
    const {title, copy} = hints[hintStep];
    let className = 'hint';
    className += showHints ? '' : ' is-hidden';
    return (
      <div ref={(root) => this.root = root } className={className}>
        <div className='hint__title'>{title}</div>
        <div className='hint__copy'>{copy}</div>
      </div>
    );
  }
}

export default Hints;