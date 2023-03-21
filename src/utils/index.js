export const HOOKS = [
      "beforeCreate",
      "created",
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestory',
      'destoryed'
]

//策略模式
let starts = {}
starts.data = function(){} //合并data
starts.comuted = function(){} //合并comuted
starts.watch = function(){} //合并watch
starts.methods = function(){} //合并methods

export function mergeOptions(parent,children){
      console.log(parent,children)
      const options = {}
      for(let key in parent){ //有父亲，没有儿子
            mergeField(key)
      }
      for(let key in children){
            mergeField(key) //有儿子，没有父亲
      }
      function mergeField(key){
            if(starts[key]){
                  options[key] = starts[key](parent[key],children[key])
            }else{
                  options[key] = children[key]
            }
      }
}