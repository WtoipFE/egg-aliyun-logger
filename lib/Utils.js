const _ = require('lodash')

const MAX_PARAM_LENGTH = 500

module.exports =  {
  /**
   * 过滤过长参数
   * @param {*} params 
   * @param {*} maxParamLength 
   */
  filterMaxParam (params, maxParamLength) {
    const nparams = {}
    params = params || {}
    maxParamLength = maxParamLength || MAX_PARAM_LENGTH
    
    _.forOwn(params, (value, key) => {
      if (String(value).length <= maxParamLength) {
        nparams[key] = value
      }
    })
    return nparams
  }
}