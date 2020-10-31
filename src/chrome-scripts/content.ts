declare const chrome: any;

const videoTitle = document.querySelector('.video-title');
if (videoTitle) {
	const containerDiv = document.createElement('div');
	containerDiv.className =
		'touchable PlayerControls--control-element nfp-popup-control';

	const appDiv = document.createElement('div') as HTMLElement;
	appDiv.id = 'plugin-meta-movie-menu';

	containerDiv.appendChild(appDiv);
}

const videoWrapper = document.querySelector('div.sizing-wrapper');
if (videoWrapper) {
	const videoOverlayDiv = document.createElement('div') as HTMLElement;
	videoOverlayDiv.id = 'plugin-meta-movie-video-overlay';
	videoWrapper.prepend(videoOverlayDiv);
}
