import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import {renderMixin} from './vnode/index'
import {initGlobApi} from './global-api/index'
function Vue(options){
    // console.log(options)
    // 初始化
    this._init(options)
}

initMixin(Vue) //初始化数据
lifecycleMixin(Vue) //初始化生命周期
renderMixin(Vue) //渲染

//全局方法
initGlobApi(Vue)
export default Vue