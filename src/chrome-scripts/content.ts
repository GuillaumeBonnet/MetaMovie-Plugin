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

function htmlToElem(html: string) {
	let temp = document.createElement('template');
	html = html.trim(); // Never return a space text node as a result
	temp.innerHTML = html;
	if (!temp.content.firstChild) {
		throw Error('Error no content');
	}
	return temp.content.firstChild;
}

function insertPluginNodes(awaitedNodes: IAwaitedNodes) {
	const menuDiv = document.createElement('div') as HTMLElement;
	menuDiv.id = 'plugin-meta-movie-menu';
	awaitedNodes.videoTitle?.after(menuDiv);

	const videoOverlayDiv = document.createElement('div') as HTMLElement;
	videoOverlayDiv.id = 'plugin-meta-movie-video-overlay';
	awaitedNodes.videoWrapper?.prepend(videoOverlayDiv);

	const fontsNode = document.createElement('link') as HTMLElement;
	fontsNode.setAttribute('rel', 'stylesheet');
	fontsNode.setAttribute(
		'href',
		'//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'
	);
	const materialCss = htmlToElem(`<link
	rel="stylesheet"
	href="https://unpkg.com/material-components-web/dist/material-components-web.min.css"
/>`);
	const materialJs = htmlToElem(`
	<script src="https://unpkg.com/material-components-web/dist/material-components-web.min.js"></script>`);
	document.querySelector('head')?.appendChild(fontsNode);
	document.querySelector('head')?.appendChild(materialCss);
	document.querySelector('head')?.appendChild(materialJs);
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
