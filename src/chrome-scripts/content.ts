
declare const chrome: any;

const videoTitle = document.querySelector('.video-title');
    const containerDiv = document.createElement('div');
    containerDiv.className = 'touchable PlayerControls--control-element nfp-popup-control';

    const appDiv = document.createElement('div') as HTMLElement;
    appDiv.id = 'plugin-meta-movie';
    
    containerDiv.appendChild(appDiv);
