import { parseHTML } from "./index";

export function compileToFunction(el){
    let ast = parseHTML(el)
    return ast
}