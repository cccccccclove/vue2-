import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import {renderMixin} from './vnode/index'
function Vue(options){
    // console.log(options)
    // 初始化
    this._init(options)
}

initMixin(Vue) //初始化数据
lifecycleMixin(Vue) //初始化生命周期
renderMixin(Vue)

export default Vue