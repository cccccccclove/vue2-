import { initState } from "./initState"
import {compileToFunction} from './compile/parseAst'
import {generate} from './compile/generate'
import {mounteComponent} from './lifecycle'

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
        vm.$el = el
        let options = vm.$options
        if(!options.render){
            let template = options.template
            if(!template && el){
                el = el.outerHTML
                //变成ast语法树
                let ast = compileToFunction(el)
                //ast语法树变成render函数->1，ast语法树变成字符串 2.字符串变成render函数
                let code = generate(ast)
                //将render字符串变成函数
                let render = new Function(`with(this){return ${code}}`)                               ///////重要！！！！
                // console.log(render)
                // render函数变成虚拟dom -- vm._render
                //将虚拟Dom变成真实DOm并放到页面上去 -- vm._update
                options.render = render
            }
        }
        //挂载组件
        mounteComponent(vm,el)
    }
}


/*
with函数：
缺点：容易导致内存泄漏
let obj = {
    a:1,
    b:2
}
with(obj){         
    console.log(a,b)
}
*/