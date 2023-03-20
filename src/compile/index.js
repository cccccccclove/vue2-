//生成ast语法树：可以操作所有东西包括js，css     虚拟dom（vnode）只可以操作节点
/**
 * 把<div id="app">hello</div>变成
 * {
 *  tag:'div',
 *  attrs:[{id:'app'}],
 *  children:[{tag:null,text:'hello'}]
 * }
 **/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //作用域标签<span:xxx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头的正则，捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配标签结尾
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/ //匹配标签结束的>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

//创建一个ast对象
function createAstElement(tag, attrs) {
    return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null,
    }
}

let root //保存根元素
let createParent //保存父节点
let stack = [] //栈

//遍历
function start(tag, attrs) { //开始标签
    let element = createAstElement(tag, attrs)
    if (!root) {
        root = element
    } else {
        createParent.children.push(element)
    }
    createParent = element
    stack.push(element)
}

function charts(text) {//文本标签
    createParent.children.push({
        type: 3,
        text
    })
}
function end(tag) {//结束标签
    let element = stack.pop()
    createParent = stack.pop[stack.length - 1]
    if (createParent) {
        element.parent = createParent.tag
        createParent.children.push(element)
    }
}


export function parseHTML(html) {
    while (html) {            //由开始标签 文本 结束标签组成
        let textEnd = html.indexOf('<')
        if (textEnd == 0) { //标签
            //结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }

            //开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
        }
        let text
        if (textEnd > 0) {//文本
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
    }
    function parseStartTag() {
        const start = html.match(startTagOpen) //1、结果(标签名) 2、false
        let match = {
            tagName: start[1],
            attrs: []
        }
        let attr
        let end
        advance(start[0].length)//删除匹配了的字符串
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            advance(attr[0].length)
        }
        if (end) {
            advance(end[0].length)
            return match
        }
    }
    function parseEndTag() { }
    function advance(n) {
        html = html.substring(n)
        // console.log(html)
    }

    // console.log(root)
    return root
}
