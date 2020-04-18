
declare const chrome: any;
const body = document.querySelector('body');
const appDiv = document.createElement('div') as HTMLElement;
    appDiv.id = 'app';
    if(body) {
        body.appendChild(appDiv);
    }
