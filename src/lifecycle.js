export function mounteComponent(vm,el){
      console.log(vm,el)
      vm._updata(vm._render())
}

export function lifecycleMixin(Vue){
      Vue.prototype._updata = function(vnode){
            console.log(vnode)
      }
}