const AliyunTransport = require('./lib/AliyunTransport')
const AliyunLog = require('./lib/AliyunLog')

module.exports = app => {
  // 注入公共函数
  app.aliyunLog = AliyunLog.bind(this, app)
  // 实例化logger通道
  if (app.config.aliyunLogger.app) app.addSingleton('aliyunLogger', createClient)
  // 插入中间件
  if (app.config.aliyunLogger.middleware) app.config.coreMiddleware.push('aliyunLogger')
}

function createClient(config, app) {
  const client = new AliyunTransport(config)
  if (config.level === 'ERROR') {
    app.getLogger('errorLogger').set(config.clientId, client)
  } else {
    app.logger.set(config.clientId, client)
  }
  return client
}