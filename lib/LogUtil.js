const _ = require('lodash')
const cookie = require('cookie')
const uuidv1 = require('uuid/v1')
const moment = require('moment')

const PutLogs = require('./PutLogs')
const Utils = require('./Utils')

const WTOIPSTAT_TAG_PREFIX = "<WTOIPSTAT_"
const WTOIPSTAT_TAG_END = "WTOIPSTAT>"

/**
 * 组装需要上报日志的内容格式
 * @param {*} options 
 */
function setContents(options) {
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  const reqid = options.reqid
  const jsonStr = JSON.stringify(Utils.filterMaxParam(options.jsonStr, options.maxParamLength) || '')
  options.contents = [{
    key: 'busicode',
    value: options.busiCode
  }, {
    key: 'jsonstr',
    value: jsonStr
  }, {
    key: 'level',
    value: options.level
  }, {
    key: 'location',
    value: ''
  }, {
    key: 'message',
    value: `${WTOIPSTAT_TAG_PREFIX}${options.busiCode}\t${time}\t${reqid}\t${jsonStr}\t${WTOIPSTAT_TAG_END}`
  }, {
    key: 'reqid',
    value: reqid
  }, {
    key: 'thread',
    value: ''
  }, {
    key: 'time',
    value: time
  }]
  return options
}

module.exports = (type, app, options, initClinet) => {
  const { clients } = app.config.aliyunLogger
  const defaultConfig = app.config.aliyunLogger.default
  const reqid = options.headers['x-request-id'] || uuidv1()
  
  for (let key in clients) {
    if (clients.hasOwnProperty(key)) {
      const client = clients[key]
      
      if (Object.prototype.toString.call(client.use) === "[object String]" && client.use !== type) break
      if (client.use && client.use.indexOf(type) === -1) break

      let params = Object.assign({}, options.params || {}, options.query)
      if (client.excludeParams) {
        const excludeParams = client.excludeParams.split(',')
        params = _.omit(params, excludeParams)
      }

      PutLogs(setContents(Object.assign({
        busiCode: 'LOGFILTER_PARAM', 
        jsonStr: params,
        reqid
      }, defaultConfig, client)))

      PutLogs(setContents(Object.assign({
        busiCode: 'LOGFILTER_COOKIE', 
        jsonStr: cookie.parse(options.headers.cookie || ''),
        reqid
      }, defaultConfig, client)))
  
      PutLogs(setContents(Object.assign({
        busiCode: 'LOGFILTER_HEADER',
        jsonStr: Object.assign({
          requestURI: options.request.url
        }, _.omit(options.headers, 'cookie')), 
        reqid
      }, defaultConfig, client)))

      const request = _.omit(JSON.parse(JSON.stringify(options.request)), 'header')
      request.requestURI = request.url

      PutLogs(setContents(Object.assign({
        busiCode: 'LOGFILTER_REQUEST', 
        jsonStr: request, 
        reqid
      }, defaultConfig, client)))
      
      if (initClinet){
        const defaultClient = Object.assign(initClinet, { reqid }, defaultConfig)
        PutLogs(setContents(Object.assign({}, defaultClient, client)))
      }
    }
  }

}