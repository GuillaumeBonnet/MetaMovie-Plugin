declare const chrome: any;

interface IAwaitedNodes {
	videoTitle: Element | null;
	video: Element | null;
	videoWrapper: Element | null;
}

const maxLoadingTime = 10000,
	initialTimestamp = Date.now(); //ms
const intervalId = setInterval(() => {
	const awaitedNodes = getAwaitedNode();
	if (awaitedNodes) {
		insertPluginNodes(awaitedNodes);
		loadScripts();
		clearInterval(intervalId);
	} else if (Date.now() - initialTimestamp > maxLoadingTime) {
		clearInterval(intervalId);
		throw Error('Video not found or did not load in time.');
	}
}, 200);

function getAwaitedNode() {
	const awaitedNodes: IAwaitedNodes = {
		videoTitle: document.querySelector('.video-title'),
		video: document.querySelector('video'),
		videoWrapper: document.querySelector('div.sizing-wrapper'),
	};
	for (const awaitedNodeKey of Object.keys(awaitedNodes)) {
		if (!awaitedNodes[awaitedNodeKey as keyof IAwaitedNodes]) {
			return false;
		}
	}
	return awaitedNodes;
}

function insertPluginNodes(awaitedNodes: IAwaitedNodes) {
	const menuDiv = document.createElement('div') as HTMLElement;
	menuDiv.id = 'plugin-meta-movie-menu';
	awaitedNodes.videoTitle?.after(menuDiv);

	const menuDivOld = document.createElement('div') as HTMLElement;
	menuDiv.id = 'plugin-meta-movie-menu-old';
	awaitedNodes.videoTitle?.after(menuDivOld);

	const videoOverlayDiv = document.createElement('div') as HTMLElement;
	videoOverlayDiv.id = 'plugin-meta-movie-video-overlay';
	awaitedNodes.videoWrapper?.prepend(videoOverlayDiv);

	const fontsNode = document.createElement('link') as HTMLElement;
	fontsNode.setAttribute('rel', 'stylesheet');
	fontsNode.setAttribute(
		'href',
		'//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
	);
	document.querySelector('head')?.appendChild(fontsNode);
}

function loadScripts() {
	const scriptNames = [
		'vue.js',
		'js/chunk-vendors.js',
		'js/content-overlay.js',
	];
	const body = document.querySelector('body');
	if (!body) {
		throw Error('no body node.');
	}
	for (const name of scriptNames) {
		const script = document.createElement('script');
		const url = chrome.runtime.getURL(`/${name}`);
		script.setAttribute('src', url);
		body.appendChild(script);
	}
}
