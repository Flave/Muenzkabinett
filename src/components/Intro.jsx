import React from 'react';
import stateStore from 'app/stateStore';

class Intro extends React.Component {
  handleClose() {
    stateStore.set({showIntro: false, showHints: true});
  }
  handleShowInfo() {
    stateStore.set({showIntro: false, showInfo: true});
  }
  render() {
    const {transform} = this.props;
    return (
      <div className="popup">
        <div className="popup__inner">
          <div className="popup__header">
            <h1 className="popup__title">Coins</h1>
            <h3 className="popup__subtitle">A Rich Cultural Collection</h3>
          </div>
          <div className="popup__main">
            <p className="popup__copy">The drawings by Frederick William IV are part of the collection of prints and drawings of the Prussian Palaces and Gardens Foundation Berlin-Brandenburg and have previously been published in a online inventory catalogue. Project partners of the research project »VIKUS – Visualising Cultural Collections.
  a online inventory catalogue. Project partners of the research project »VIKUS – Visualising Cultural Collections.</p>
          </div>
          <div className="popup__footer">
            <button onClick={this.handleClose} className="popup__btn btn btn--big btn--primary">Let's do this</button>
            <button onClick={this.handleShowInfo} className="popup__btn btn btn--big btn--secondary">More info</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;