import React from 'react';

class Intro extends React.Component {
  render() {
    return (
      <div className="intro">
        <div ref={(ref) => this.root = ref}>This is what blabla looks like!</div>
      </div>
    );
  }
}

export default Intro;