const _ = require('lodash')
const cookie = require('cookie')
const uuidv1 = require('uuid/v1')

const PutLogs = require('./PutLogs')

module.exports = (app, busiCode, jsonStr, ctx) => {
  const { clients } = app.config.aliyunLogger
  const defaultConfig = app.config.aliyunLogger.default
  const reqid = uuidv1();
  
  const defaultClient = Object.assign({
    busiCode,
    jsonStr,
    reqid
  }, defaultConfig);

  for (let key in clients) {
    if (clients.hasOwnProperty(key)) {
      const  client = clients[key]

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_PARAM', 
        jsonStr: Object.assign({}, ctx.params, ctx.query),
        reqid
      }, defaultConfig, client))

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_COOKIE', 
        jsonStr: cookie.parse(ctx.headers.cookie),
        reqid
      }, defaultConfig, client))
  
      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_HEADER',
        jsonStr: Object.assign({
          requestURI: ctx.request.url
        }, _.omit(ctx.headers, 'cookie')), 
        reqid
      }, defaultConfig, client))

      const request = _.omit(JSON.parse(JSON.stringify(ctx.request)), 'header')
      request.requestURI = request.url

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_REQUEST', 
        jsonStr: request, 
        reqid
      }, defaultConfig, client))
      
      PutLogs(Object.assign({}, defaultClient, client))
    }
  }

};