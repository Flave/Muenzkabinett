import React from 'react';
import stateStore from 'app/stateStore';
import LoadingIndicator from 'components/LoadingIndicator.jsx';

class Info extends React.Component {
  handleClick() {
    stateStore.set({showInfo: !stateStore.get().showInfo});
  }
  render() {
    const state = stateStore.get();
    const showMenu = !state.showIntro && state.highResLoaded;
    return (
      <div className="menu">
        {showMenu && <span onClick={this.handleClick} className="menu__button">Info</span>}
        {!state.highResLoaded && <LoadingIndicator 
            loadingProgress={state.loadingProgress}
            dataLoaded={state.dataLoaded}
            lowResLoaded={state.lowResLoaded}
            highResLoaded={state.highResLoaded} />}
      </div>
    );
  }
}

export default Info;