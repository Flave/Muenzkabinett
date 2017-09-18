import React from 'react';

class MobileWarning extends React.Component {
  render() {
    return (
      <div className="mobile-warning">
        <div className="mobile-warning__inner">
          <div className="mobile-warning__title">Hi there</div>
          <div className="mobile-warning__copy">Please note that this little Tool will withdraw a considerable amount of coins...I mean load <b>a lot of data</b> (On mobile device a reduced dataset will be loaded of ~15MB). This might take a while and might make a dent in your data plan. Also the experience on a powerful desktop browser will be much more enjoyable.</div>
          <div onClick={this.props.onPermit} className="mobile-warning__btn">Fine with me</div>
          <div className="mobile-warning__btn mobile-warning__btn--cta">
            <a href="mailto:?subject=Coins — A Rich Cultural Collection&body=Hey! This is the coins website from earlier that wanted to download too much data http://uclab.fh-potsdam.de/coins">Email myself for later</a>
          </div>
        </div>
      </div>
    )
  }
}

export default MobileWarning;