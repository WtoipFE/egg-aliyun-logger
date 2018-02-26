const LogUtil = require('../../lib/LogUtil')

module.exports = (options, app) => {
  return function* (next) {
    yield next
    
    LogUtil('middleware', this.app, this)
  }
}