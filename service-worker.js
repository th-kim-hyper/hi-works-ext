
function init() {
  console.log('Service worker initialized');
  chrome.action.disable();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message:', message);
    if (message === 'content_script_loaded') {
      setAction(sender.tab.id, true);
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      console.log('Page load completed:', tab.url);

      if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
        console.log('Valid URL:', tab.url);

        // 특정 탭에서 스크립트 실행
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            console.log('Script executed in tab:', document.location.href);
            // 여기에 실행할 스크립트를 작성하세요.
          }
        }, (results) => {
          if (chrome.runtime.lastError) {
            console.error('Script execution failed:', chrome.runtime.lastError);
          } else {
            console.log('Script execution results:', results);
          }
        });

      } else {
        console.log('Invalid URL:', tab.url);
        return;
      }

    }
  });

  
}

function setAction(tabId, enable) {
  console.log('Set action:', enable);
  if (enable) {
    chrome.action.setIcon({
      tabId: tabId,
      path: {
        "16": "images/icon-16.png",
        "32": "images/icon-32.png",
        "48": "images/icon-48.png",
        "128": "images/icon-128.png"
      }
    });
    chrome.action.enable(tabId);
  } else {
    chrome.action.setIcon({
      tabId: tabId,
      path: {
        "16": "images/icon-16-disabled.png",
        "32": "images/icon-32-disabled.png",
        "48": "images/icon-48-disabled.png",
        "128": "images/icon-128-disabled.png"
      }
    });
    chrome.action.disable(tabId);
  }
}

init();
