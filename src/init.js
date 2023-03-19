import { initState } from "./initState"
import {compileToFunction} from './compile/index'
export function initMixin(Vue) { //把vue传过来以便使用vue.propertype
    Vue.prototype._init = function (options) {
        let vm = this
        // console.log(this)      //=>Vue实例
        vm.$options = options
        //初始化状态
        initState(vm)
        //模板编译  ->  查看vue官网的生命周期
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    //创建$mount
    Vue.prototype.$mount = function (el) {
        let vm = this
        el = document.querySelector(el)
        let options = vm.$options
        if(!options.render){
            let template = options.template
            if(!template && el){
                el = el.outerHTML
                //变成ast语法树
                let ast = compileToFunction(el)
            }
        }
    }
}

