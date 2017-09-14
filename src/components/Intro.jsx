import React from 'react';

class Intro extends React.Component {
  render() {
    const {transform} = this.props;
    return (
      <div ref={(ref) => this.root = ref} style={{top: 0 * transform.k, left: 0 * transform.k}} className="intro">
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
        <div>This is what blabla looks like!</div>
      </div>
    );
  }
}

export default Intro;