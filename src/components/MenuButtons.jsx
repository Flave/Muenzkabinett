import React from 'react';
import stateStore from 'app/stateStore';

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHint: false
    }
    this.handleNopeClick = this.handleNopeClick.bind(this);
  }
  handleNopeClick() {
    this.setState({showHint: false});
  }
  render() {
    return (
      <div className="menu__buttons">
        <span onClick={this.props.onInfoClick} className="menu__button">Info</span>
      </div>
    );
  }
}

export default Info;