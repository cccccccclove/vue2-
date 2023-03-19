/*
render(){ _c解析标签
    return _c('div',{id:app,style:{color:red,font-size:12px}},-v('hello'+_s(msg)),_c)
}
*/

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //{{}}

//处理属性
function genPorps(attrs){
    let str = ''
    for(let i = 0; i < attrs.length; i++){
        let attr = attrs[i]
        if(attr.name == 'style'){
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key,val] = item.split(':')
                obj[key] = val
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return str.slice(0,-1)
}

//处理子节点
function genChildren(el){
    let children = el.children
    if(children){
        return children.map(child => gen(child)).join(',')
    }
}

function gen(node){ //1.元素  3.文本
    if(node.type == 1){
        return generate(node)
    }else{
        let text =node.text
        if(!defaultTagRE.test(text)){ //纯文本，不包含插值表达式
            return `_v(${JSON.stringify(text)})`
        }
        let token = []
        let lastindex = defaultTagRE.lastIndex = 0 //把正则表达式匹配到的下标重新置为0，否者无法再次使用正则
        let match
        while(match = defaultTagRE.exec(text)){
            console.log(match)
            let index = match.index
            if(index > lastindex){ //文本
                token.push(JSON.stringify(text.slice(lastindex,index)))
            }
            token.push(`_s(${match[1].trim()})`)
            lastindex = index + match[0].length
        }
        if(lastindex < text.length){
            token.push(JSON.stringify(text.slice(lastindex)))
        }
        return `_v(${token.join('+')})`
    }
}

export function generate(el){
    // console.log(el)
    let children = genChildren(el)
    // console.log(children)
    let code = `_c(${el.tag},${el.attrs.length?`${genPorps(el.attrs)}`:'null'}),${children?`${children}`:'null'}`
    console.log(code)
}