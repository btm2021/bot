const ta = require('ta.js');
module.exports = {
  info: () => {
    return {
      name: 'RSI',
      author: 'baotm',
      dateAdd: '02/11/2024',
      description: 'Tìm ra rsi phân kì',
    };
  },
  analyze: (df, period = 14) => {
    try {
      let rsi = ta.wrsi(df['close'].values, period);
      for (let i = 0; i < period; i++) {
        rsi.unshift(0);
      }
      df.addColumn('rsi', rsi, { inplace: true });
      return {
        msg: `RSI (${period} periods): ${rsi}`,
        df,
      };
    } catch (error) {
      console.log(error);
      return 'Unable to calculate RSI: ' + error.message;
    }
  },
};
