export const MARGIN = {
  TOP: 0,
  LEFT: 0,
  BOTTOM: 0,
  RIGHT: 0
}

export const COIN_HEIGHT = 40;
export const COINS_PER_SHEET = 1000;

const userAgent = {};

if (/(android)/i.test(navigator.userAgent)) {
  userAgent.android = true;
  userAgent.androidVersion = parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("Android")+8));
} else if (/iP(hone|od|ad)/.test(navigator.platform)) {
  const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  userAgent.iOS = true;
  userAgent.iOSVersion = [
    parseInt(v[1], 10),
    parseInt(v[2], 10),
    parseInt(v[3] || 0, 10),
  ];

} else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  userAgent.firefox = true;
} else if (document.documentMode || /Edge/.test(navigator.userAgent)) {
  userAgent.ie = true;
}

export const USER_AGENT = {
  ...userAgent
};