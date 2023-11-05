const fs = require("fs");
const path = require("path");
const TAFFY = require("taffydb").taffy;
const pluginsDir = path.join(__dirname, "plugins");
const plugins = {};
const utils = require("./utils.js");
const pluginFiles = fs.readdirSync(pluginsDir);
const danfo = require("danfojs");
console.clear();
console.log("========= START =========\n");
console.log("[INIT].Load plugin");
let strMess = [];
pluginFiles.forEach((file) => {
  const pluginPath = path.join(pluginsDir, file);
  const plugin = require(pluginPath);
  plugins[plugin.info().name] = plugin;
  strMess.push({
    Name: plugin.info().name,
    Author: plugin.info().author,
    Date: plugin.info().dateAdd,
  });
});
console.table(strMess);
console.log("[INIT].Load pair");
let filePair = require("./pair.json");
var pairList = TAFFY(filePair);
var finalResult = new Map();
console.table(pairList().get());
console.log("==================\n");
pairList.settings({
  onDBChange: () => {
    //getall
    let listPair = [];
    pairList()
      .get()
      .map((item) => {
        listPair.push({ name: item.name });
      });
    fs.writeFileSync("pair.json", JSON.stringify(listPair));
  },
});
//function util
function init() {
  pairList()
    .get()
    .map((item) => {
      handleSymbol(item.name, "15m");
    });
}
async function handleSymbol(symbol, timeframe = "15m") {
  console.log(symbol);

  let ohlcv = await utils.fetchOHLCV(symbol, timeframe);
  let df = utils.get_list_close(ohlcv.ohlcv);

  for (const pluginName in plugins) {
    const plugin = plugins[pluginName];
    const pluginResult = plugin.analyze(df);
    finalResult.set(symbol, pluginResult.df);
    let str = danfo.toCSV(pluginResult.df);
    fs.writeFileSync("./public/result.csv", str);
  }
}
init();

//webserver

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log(finalResult.keys());
  res.send(JSON.stringtify(finalResult["IMXUSDT"]));
  //res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
