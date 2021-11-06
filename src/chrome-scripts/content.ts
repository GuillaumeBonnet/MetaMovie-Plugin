declare const browser: any;

interface IAwaitedNodes {
	videoTitle: Element | null;
	video: Element | null;
	videoWrapper: Element | null;
}

chrome.runtime.onMessage.addListener(
	(message: any, sender: any, sendResponse: Function) => {
		if (message == 'HistoryStateUpdated') {
			startingPoint();
		}
	}
);

const startingPoint = () => {
	if (!/watch\/(\d+)/.test(location.pathname)) {
		return;
	}
	const maxLoadingTime = 20000,
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
};
startingPoint();

function getAwaitedNode() {
	const awaitedNodes: IAwaitedNodes = {
		videoTitle: document.querySelector<any>('[data-uia="video-title"'),
		video: document.querySelector('video'),
		videoWrapper: document.querySelector<any>('[data-uia="player"]'),
	};
	for (const awaitedNodeKey of Object.keys(awaitedNodes)) {
		if (!awaitedNodes[awaitedNodeKey as keyof IAwaitedNodes]) {
			return false;
		}
	}
	return awaitedNodes;
}

function htmlToElem(html: string) {
	const temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	if (!temp.content.firstChild) {
		throw Error('Error no content');
	}
	return temp.content.firstChild;
}

function insertPluginNodes(awaitedNodes: IAwaitedNodes) {
	if (!document.querySelector<any>('#plugin-meta-movie-video-overlay')) {
		const videoOverlayDiv = document.createElement('div') as HTMLElement;
		videoOverlayDiv.id = 'plugin-meta-movie-video-overlay';
		awaitedNodes.videoWrapper?.append(videoOverlayDiv);
	}
	if (!document.querySelector<any>('#plugin-meta-movie-menu')) {
		const menuDiv = document.createElement('div') as HTMLElement;
		menuDiv.id = 'plugin-meta-movie-menu';
		awaitedNodes.videoWrapper?.append(menuDiv);
	}
	if (!document.querySelector<any>('#plugin-meta-movie-popups')) {
		const popUpsDiv = document.createElement('div') as HTMLElement;
		popUpsDiv.id = 'plugin-meta-movie-popups';
		awaitedNodes.videoWrapper?.append(popUpsDiv);
	}

	if (!document.querySelector<any>('#plugin-meta-movie-link-font')) {
		const fontsNode = document.createElement('link') as HTMLElement;
		fontsNode.id = 'plugin-meta-movie-link-font';
		fontsNode.setAttribute('rel', 'stylesheet');
		fontsNode.setAttribute(
			'href',
			'//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
		);
		document.querySelector('head')?.appendChild(fontsNode);
	}
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
