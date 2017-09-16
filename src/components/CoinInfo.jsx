import React from 'react';
import coinProperties from 'constants/coinProperties';
import {createLabelData} from 'utility';

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
    const compact = transform.k < .6;
    let className = 'coin-info';
    className += compact ? ' coin-info--compact' : '';
    const fullCoinId = createFullCoinId(coin.data.id);
    const linkCopy = compact ? '7' : 'View in collection';

    return (
      <div 
        className={className}
        style={{
          left: (coin.position.x + 20) * transform.k,
          top: (coin.position.y + 60) * transform.k
        }}>
        <div className='coin-info__header'>
          <div className='coin-info__title'>{coin.data.title}</div>
            <a className='coin-info__link' 
              target='_blank' 
              href={`http://ikmk.smb.museum/object?id=182${fullCoinId}`}>
              <i className='coin-info__link-icon icon-arrow_top_right'/>
              {linkCopy}
            </a>
        </div>
        {!compact && <div className='coin-info__props'>
          {coinProperties.map((prop, i) => {
            if(!prop.selectable) return;
            const labelData = createLabelData(prop, coin.data[prop.key]);

            let valueClassName = 'coin-info__prop-value';
            valueClassName += prop.type === 'discrete' ? ' coin-info__prop-value--filterable' : '';
            return (
              <div key={i} className='coin-info__prop'>
                <i className={`coin-info__prop-icon icon-${prop.key}`}></i>
                <div className='coin-info__prop-label'>{prop.label}</div>
                <div className={valueClassName}>{labelData.value} {labelData.unit}</div>
              </div>
            )
          })}
        </div>}
      </div>
    );
  }
}

export default CoinInfo;