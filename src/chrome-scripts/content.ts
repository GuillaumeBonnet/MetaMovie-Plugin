
declare const chrome: any;

console.log("gboDebug: content.ts");

const pocComp = document.createElement('hello-world');
pocComp.setAttribute("msg", "gbop toto");
let body = document.querySelector('body');
if(body) {
    body.appendChild(pocComp);
}
console.log("gboDebug:[end of content file]");

