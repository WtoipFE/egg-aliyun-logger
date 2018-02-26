const ip = require('ip')
const ALY = require('aliyun-sdk')

// todo: 直接上报会影响性能，待优化
module.exports = (options) => {
  const sls = new ALY.SLS({
    // 在阿里云OSS申请的 accessKeyId
    accessKeyId: options.accessKeyId,

    // 在阿里云OSS申请的 secretAccessKey
    secretAccessKey: options.secretAccessKey,

    // sts token 中的 securityToken
    // securityToken: "",

    // 根据你的 sls project所在地区选择填入
    endpoint: options.endpoint,

    // 这是 sls sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '2015-06-01'

    //以下是可选配置
    //,httpOptions: {
    //    timeout: 1000  //1sec, 默认没有timeout
    //}
  })
 
  sls.putLogs({
    projectName: options.projectName,
    logStoreName: options.logStoreName,
    logGroup: {
      logs: [{
        time: Math.floor(new Date().getTime() / 1000),
        contents: options.contents
      }],
      topic: options.topic,
      source: ip.address()
    }
  }, function (err, data) {

    if (err) {
      console.log('error:', err)
      return
    }

  })
}

