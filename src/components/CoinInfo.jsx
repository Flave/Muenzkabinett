import React from 'react';
import coinProperties from 'constants/coinProperties';

function createFullCoinId(id) {
  id = id.toString();
  while(id.length < 5) {
    id = `0${id}`
  }
  return id;
}

class CoinInfo extends React.Component {
  componentDidUpdate() {
    //console.dir(this.root);
  }


  render() {
    const {coin, transform} = this.props;
    const compact = transform.k < .5;
    let className = 'coin-info';
    className += compact ? ' coin-info--compact' : '';
    const fullCoinId = createFullCoinId(coin.data.id);

    return (
      <div 
        className={className}
        style={{
          left: (coin.position.x + 20) * transform.k,
          top: (coin.position.y + 60) * transform.k
        }}>
        <div className="coin-info__title">
          <a className="coin-info__link" target="_blank" href={`http://ikmk.smb.museum/object?id=182${fullCoinId}`}>{coin.data.title}</a>
        </div>
        {!compact && <div className="coin-info__props">
          {coinProperties.map((prop, i) => {
            if(!prop.selectable) return;
            const value = coin.data[prop.key] !== '' ? coin.data[prop.key] : 'Unknown';
            return (
              <div key={i} className="coin-info__prop">
                <i className={`coin-info__prop-icon icon-${prop.key}`}></i>
                <div className="coin-info__prop-label">{prop.label}</div>
                <div>
                  <span className="coin-info__prop-value">{value}</span>
                </div>
              </div>
            )
          })}
        </div>}
      </div>
    );
  }
}

export default CoinInfo;