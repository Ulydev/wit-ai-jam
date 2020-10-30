chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "ZOOM": {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.getZoom(tabs[0].id, zoom => {
                    chrome.tabs.setZoom(tabs[0].id, zoom * message.factor)
                })
            })
        } break
        case "NAVIGATE": {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                (message.direction === "back" ? chrome.tabs.goBack : chrome.tabs.goForward)(tabs[0].id)
            })
        }
    }
})