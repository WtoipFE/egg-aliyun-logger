const LogUtil = require('./LogUtil')

module.exports = (app, busiCode, jsonStr, ctx) => {
  LogUtil('aliyunLog', app, ctx, {
    busiCode,
    jsonStr
  })
}