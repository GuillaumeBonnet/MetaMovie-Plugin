// declare const chrome: any;
console.log('gboDebug:[before callbacks] background.ts');

chrome.runtime.onInstalled.addListener(() => {
	chrome.webNavigation.onCompleted.addListener(
		() => {
			console.log('gboDebug:[on navigation completed]');

			chrome.tabs.query(
				{ active: true, currentWindow: true },
				([{ id }]: any) => {
					console.log('gboDebug:[before show id]');
					chrome.default_popup.show(id);
				}
			);
		},
		{ url: [{ urlMatches: 'https://duckduckgo.com/' }] }
	);
});
