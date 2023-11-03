const axios = require('axios');
const df = require('danfojs');
module.exports = {
  async fetchOHLCV(symbol, interval, limit = 1000) {
    return new Promise(async (resolve, reject) => {
      const response = await axios.get(
        `https://fapi.binance.com/fapi/v1/klines`,
        {
          params: {
            symbol,
            interval,
            limit, // Số lượng cây nến OHLCV bạn muốn lấy
          },
        }
      );
      const ohlcvData = response.data;
      resolve({ symbol, interval, limit, ohlcv: ohlcvData });
    });
  },
  get_list_close(ohlcv) {
    let result = this.get_list_raw(ohlcv);
    return result;
  },
  get_list_raw(ohlcv) {
    let result = [];
    ohlcv.map((item) => {
      let {
        time,
        open,
        high,
        low,
        close,
        volume,
        closetime,
        quote,
        numbertrade,
        takerbuy,
        takerquote,
        ignore,
      } = item;
      result.push({
        time: parseInt(item[0]),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
      });
    });
    return new df.DataFrame(result);
  },
  formatResult(result, period) {
    for (let i = 0; i < period; i++) {
      result.unshift(0);
    }
    return result;
  },
};
