import React from 'react';
import stateStore from 'app/stateStore';
import LoadingIndicator from 'components/LoadingIndicator.jsx';
import MenuButtons from 'components/MenuButtons.jsx';

class Info extends React.Component {
  handleClick() {
    stateStore.set({showInfo: !stateStore.get().showInfo});
  }
  render() {
    const state = stateStore.get();
    const showMenu = !state.showIntro && state.highResLoaded;
    return (
      <div className="menu">
        {showMenu && <MenuButtons onInfoClick={this.handleClick}/>}
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