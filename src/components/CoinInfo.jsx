import React from 'react';
import coinProperties from 'constants/coinProperties';
import {createLabelData, createFullCoinId} from 'utility';
import _find from 'lodash/find';

class CoinInfo extends React.Component {
  componentDidUpdate() {
    //console.dir(this.root);
  }

  createProperty(coin, prop, i) {
    if(!prop.selectable) return;
    const {onLabelClick, coinFilters} = this.props;
    const rawValue = coin.data[prop.key];
    const labelData = createLabelData(prop, rawValue);
    const onClick = prop.type === "discrete" ? onLabelClick.bind(null, [{key: prop.key, value: rawValue}]) : undefined;
    const isSelected = _find(coinFilters, {key: prop.key}) !== undefined;
    let valueClassName = 'coin-info__prop-value';
    valueClassName += prop.type === 'discrete' ? ' coin-info__prop-value--filterable' : '';
    valueClassName += isSelected ? ' is-selected' : '';

    return (
      <div key={i} className='coin-info__prop'>
        <i className={`coin-info__prop-icon icon-${prop.key}`}></i>
        <div className='coin-info__prop-label'>{prop.label}</div>
        <div 
          onClick={onClick} 
          className={valueClassName}>{labelData.value} {labelData.unit}</div>
      </div>
    )
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
              {linkCopy}
              <i className='coin-info__link-icon icon-arrow_top_right'/>
            </a>
        </div>
        {!compact && <div className='coin-info__props'>
          {coinProperties.map(this.createProperty.bind(this, coin))}
        </div>}
      </div>
    );
  }
}

export default CoinInfo;