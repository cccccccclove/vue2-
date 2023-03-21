export function patch(oldNode,vnode){
      //vnode变成真实dom
      //1.创建新的dom
      let el = createEl(vnode)
      //2.替换 -》获取父节点。把新的节点插入。删除
      // console.log(oldNode,vnode)
      let parentEl = oldNode.parentNode
      parentEl.insertBefore(el,oldNode.nextsibling)
      parentEl.removeChild(oldNode)
      return el
}

function createEl(vnode){
      let {tag,children,key,data,text} = vnode
      if(typeof tag == 'string'){ //标签
            vnode.el = document.createElement(tag)
            if(children.length > 0){
                  children.forEach(child=>{
                        vnode.el.appendChild(createEl(child))
                  })
            }
      }else{
            vnode.el = document.createTextNode(text)
      }
      return vnode.el
}