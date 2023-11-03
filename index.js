const fs = require('fs');
const path = require('path');
const TAFFY = require('taffydb').taffy;
const pluginsDir = path.join(__dirname, 'plugins');
const plugins = {};
const utils = require('./utils.js');
const pluginFiles = fs.readdirSync(pluginsDir);
console.clear();
console.log('========= START =========\n');
console.log('[INIT].Load plugin');
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
console.log('[INIT].Load pair');
let filePair = require('./pair.json');
var pairList = TAFFY(filePair);
console.table(pairList().get());
console.log('==================\n');
pairList.settings({
  onDBChange: () => {
    //getall
    let listPair = [];
    pairList()
      .get()
      .map((item) => {
        listPair.push({ name: item.name });
      });
    fs.writeFileSync('pair.json', JSON.stringify(listPair));
  },
});
//function util
function init() {
  pairList()
    .get()
    .map((item) => {
      handleSymbol(item.name);
    });
}
async function handleSymbol(symbol) {
  console.log(symbol);

  let ohlcv = await utils.fetchOHLCV(symbol, '15m');
  let df = utils.get_list_close(ohlcv.ohlcv);

  for (const pluginName in plugins) {
    const plugin = plugins[pluginName];
    const pluginResult = plugin.analyze(df);
    //pluginResult.df.tail().print();
  }
}
init();
