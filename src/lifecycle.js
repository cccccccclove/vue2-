import { patch } from "./vnode/patch"
export function mounteComponent(vm,el){
      // console.log(vm,el)
      vm._updata(vm._render()) //vm._render 把render函数变成虚拟dom，vm_updata再把它变成真实dom
}

export function lifecycleMixin(Vue){
      Vue.prototype._updata = function(vnode){
            // console.log(vnode)
            let vm = this
            vm.$el = patch(vm.$el, vnode) //两个参数：旧的dom，虚拟dom
      }
}