
declare const chrome: any;

let body = document.querySelector('body');
let appDiv = document.createElement('div') as HTMLElement;
appDiv.id = 'app';
appDiv.setAttribute('style', 'position:fixed; top:0;');
if(body) {
    body.appendChild(appDiv);
}
