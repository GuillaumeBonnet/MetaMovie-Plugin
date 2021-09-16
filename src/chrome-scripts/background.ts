declare const chrome: any;

chrome.runtime.onInstalled.addListener(() => {});

chrome.webNavigation.onCompleted.addListener(
	(event: any) => {
		if (event.frameId !== 0) {
			return;
		}
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			(tabQueryResults: Array<{ id: number }>) => {
				if (tabQueryResults && tabQueryResults[0] && tabQueryResults[0].id) {
					const tabId = tabQueryResults[0].id;
					chrome.webNavigation.onHistoryStateUpdated.addListener(
						(event: Event) => {
							chrome.tabs.sendMessage(tabId, 'HistoryStateUpdated');
						}
					);
				}
			}
		);
	}
	// { url: [{ urlMatches: '<all_urls>' }] }
);
