const PutLogs = require('./PutLogs')
const Transport = require('egg-logger').Transport
 
class AliyunTransport extends Transport {
  constructor(options) {
    super(options)
  }

  log(level, args, meta) {
    const { options } = this
    const type = 'transport'
    
    if (Object.prototype.toString.call(options.use) === "[object String]" && options.use !== type) return
    if (options && options.use.indexOf(type) === -1) return

    const jsonStr = super.log(level, args, meta)
    this.options.contents = [{
      key: 'content',
      value: jsonStr
    }]
    return PutLogs(this.options)
  }
}

module.exports = AliyunTransport