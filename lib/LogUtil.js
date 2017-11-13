const _ = require('lodash')
const cookie = require('cookie')
const uuidv1 = require('uuid/v1')

const PutLogs = require('./PutLogs')

module.exports = (app, options, initClinet) => {
  const { clients } = app.config.aliyunLogger
  const defaultConfig = app.config.aliyunLogger.default
  const reqid = options.headers['x-request-id'] || uuidv1();
  
  for (let key in clients) {
    if (clients.hasOwnProperty(key)) {
      const  client = clients[key]

      let params = Object.assign({}, options.params || {}, options.query)
      if (client.excludeParams) {
        const excludeParams = client.excludeParams.split(',')
        params = _.omit(params, excludeParams)
      }

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_PARAM', 
        jsonStr: params,
        reqid
      }, defaultConfig, client))

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_COOKIE', 
        jsonStr: cookie.parse(options.headers.cookie),
        reqid
      }, defaultConfig, client))
  
      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_HEADER',
        jsonStr: Object.assign({
          requestURI: options.request.url
        }, _.omit(options.headers, 'cookie')), 
        reqid
      }, defaultConfig, client))

      const request = _.omit(JSON.parse(JSON.stringify(options.request)), 'header')
      request.requestURI = request.url

      PutLogs(Object.assign({
        busiCode: 'LOGFILTER_REQUEST', 
        jsonStr: request, 
        reqid
      }, defaultConfig, client))
      
      if (initClinet){
        const defaultClient = Object.assign(initClinet, { reqid }, defaultConfig);
        PutLogs(Object.assign({}, defaultClient, client))
      }
    }
  }

};