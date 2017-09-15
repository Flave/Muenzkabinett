import React from 'react';

class LoadingIndicator extends React.Component {
  render() {
    const {dataLoaded, lowResLoaded, highResLoaded, loadingProgress} = this.props;
    let copy = 'Loading Data';
    let totalProgress = loadingProgress;
    if(dataLoaded) {
      totalProgress++;
      copy = 'Loading Coins';
    }
    if(lowResLoaded) {
      totalProgress++;
    }

    const progress = Math.ceil(totalProgress/3 * 100);

    return (
      <div className='loading-indicator'>
        <div 
          style={{width: `${progress}%`}} 
          className='loading-indicator__bar'/>
        <div 
          style={{left: `${progress}%`}} 
          className='loading-indicator__copy'>
          <b className='loading-indicator__strong'>{copy}</b>&ensp;{progress}%
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;