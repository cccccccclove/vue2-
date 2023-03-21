export function renderMixin(Vue){
      Vue.prototype._c = function(){
            return createElement(...arguments)
      }
      Vue.prototype._v = function(text){
            return createText(text)
      }
      Vue.prototype._s = function(val){
            // console.log(this.data[val])
           return val==null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
      }
      Vue.prototype._render = function(){    //render函数变成vode
            let vm = this
            let render = vm.$options.render
            let vnode = render.call(this)
            return vnode

      }
}

//创建文本
function createText(text){
      return vnode(undefined,undefined,undefined,undefined,text)
}
//创建元素
function createElement(tag,data={},...children){
      return vnode(tag,data,data.key,children)
}

function vnode(tag,data,key,children,text){
      return {
            tag,data,key,children,text
      }
}