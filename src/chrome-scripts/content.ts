
declare const chrome: any;
const fullScreenDiv = document.querySelector('div.sizing-wrapper');
const appDiv = document.createElement('div') as HTMLElement;
    appDiv.id = 'plugin-meta-movie';
    if(fullScreenDiv) {
        fullScreenDiv.appendChild(appDiv);
    }
