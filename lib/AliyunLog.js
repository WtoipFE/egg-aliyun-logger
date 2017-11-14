const LogUtil = require('./LogUtil')

module.exports = (app, busiCode, jsonStr, ctx) => {
  LogUtil(app, ctx, {
    busiCode,
    jsonStr
  })
}