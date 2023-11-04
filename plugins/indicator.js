const ta = require("ta.js");
const pandas = require("danfojs");
function formatResult(result, period) {
  for (let i = 0; i < period - 1; i++) {
    result.unshift(0);
  }
  return result;
}
function formatResult_array(result, period) {
  for (let i = 0; i < period - 1; i++) {
    result.unshift([]);
  }
  return result;
}
module.exports = {
  info: () => {
    return {
      name: "Indicator",
      author: "baotm",
      dateAdd: "02/11/2024",
      description: "Tìm các indicator quan trọng và thêm vào dataframe ",
    };
  },
  analyze: (df, period = 14) => {
    try {
      df.addColumn("ema14", formatResult(ta.ema(df["close"].values, 14), 14), {
        inplace: true,
      });
      df.addColumn("ema34", formatResult(ta.ema(df["close"].values, 34), 34), {
        inplace: true,
      });
      df.addColumn("ema55", formatResult(ta.ema(df["close"].values, 55), 55), {
        inplace: true,
      });
      df.addColumn("ema89", formatResult(ta.ema(df["close"].values, 89), 89), {
        inplace: true,
      });
      df.addColumn(
        "ema100",
        formatResult(ta.ema(df["close"].values, 100), 100),
        {
          inplace: true,
        },
      );
      df.addColumn(
        "ema200",
        formatResult(ta.ema(df["close"].values, 200), 200),
        {
          inplace: true,
        },
      );
      df.addColumn(
        "ema610",
        formatResult(ta.ema(df["close"].values, 610), 610),
        {
          inplace: true,
        },
      );

      let highlow = df.loc({ columns: ["high", "low"] }).values;
      let don = ta.don(highlow, 50);
      don = formatResult_array(don, 50);
      let transformedArray = don.map((item) => {
        return { up: item[0], mid: item[1], down: item[2] };
      });
      df.addColumn(
        "donchian_up",
        transformedArray.map((item) => item.up),
        {
          inplace: true,
        },
      );

      df.addColumn(
        "donchian_mid",
        transformedArray.map((item) => item.mid),
        {
          inplace: true,
        },
      );

      df.addColumn(
        "donchian_down",
        transformedArray.map((item) => item.down),
        {
          inplace: true,
        },
      );

      return {
        msg: `RSI (${period} periods)}`,
        df,
      };
    } catch (error) {
      console.log(error);
      return "Unable to calculate RSI: " + error.message;
    }
  },
};
