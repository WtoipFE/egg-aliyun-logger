const _ = require('lodash')

const LogUtil = require('../../lib/LogUtil')
const PutLogs = require('../../lib/PutLogs')
const Utils = require('../../lib/utils')

module.exports = {
    /**
     * 支持两种方式：
     * aliyunLog('busiCode', logData)，用于上报到olap，使用固定的日志格式
     * aliyunLog(logData)，用于自定义日志格式上报
     * @param {*} arg 
     */
    aliyunLog(...arg) {
      if (arg.length > 1 && Object.prototype.toString.call(arg[0]) === "[object String]") {
        LogUtil(this.app, this.ctx, {
          busiCode: arg[0],
          jsonStr: arg[1]
        })
      } else if(arg.length === 1 && Object.prototype.toString.call(arg[0]) === "[object Object]") {
        const { clients } = this.app.config.aliyunLogger
        const defaultConfig = this.app.config.aliyunLogger.default
        for (let key in clients) {
          if (clients.hasOwnProperty(key)) {
            const  client = clients[key]
            const contents = []
            let content = Utils.filterMaxParam(arg[0], client.maxParamLength)

            if (client.excludeParams) {
              const excludeParams = client.excludeParams.split(',')
              content = _.omit(content, excludeParams)
            }

            _.forOwn(content, (value, key) => {
              contents.push({ key: key, value: JSON.stringify(value) })
            })

            PutLogs(Object.assign({ contents }, defaultConfig, client))
          }
        }
      } else {
        console.error('aliyunLog:参数错误')
      }
    },
};