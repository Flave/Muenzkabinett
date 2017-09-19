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
            <p className="popup__copy">Do you remember playing with the coins of your parents? The journeys they spoke of? Now you have the chance to do the same thing again, but this time with a lot more coins belonging to one of the biggest coin collections in the world, the Münzkabinett Berlin! Every coin has its own history. Even Caesar or Alexander the Great could have held some of them in his hands or could have spent them on his world changing wars. This tool gives you the chance to explore these coins and sort them through different layouts and filters. Please be our guest and help us with our big chaos right here…</p>
          </div>
          <div className="popup__footer">
            <button onClick={this.handleClose} className="popup__btn btn btn--big btn--primary">Let's do this</button>
            <button onClick={this.handleShowInfo} className="popup__btn btn btn--big btn--secondary">More info</button>
            {/*<p className="popup__small">(This tool is built for the latest versions of all major browsers)</p>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;