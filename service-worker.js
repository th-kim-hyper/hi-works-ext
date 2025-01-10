// import './s1.js';
// import './s2.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'content_script_loaded') {
    chrome.action.setIcon({
        tabId: sender.tab.id,
        path: {
          "16": "images/icon-16.png",
          "32": "images/icon-32.png",
          "48": "images/icon-48.png",
          "128": "images/icon-128.png"
        }
      });
    // chrome.action.setBadgeText({text: 'ON'});
    // chrome.action.setBadgeBackgroundColor({color: '#4688F1'});      
    chrome.action.enable(sender.tab.id);
  }
});

// 페이지가 로드될 때마다 배지 초기화
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete') {
//       chrome.action.setBadgeText({ text: '', tabId: tabId });
//       chrome.action.setBadgeBackgroundColor({ color: '#000000', tabId: tabId });
//     }
//   });

// 기본적으로 아이콘 비활성화
chrome.action.disable();
// chrome.action.setBadgeText({ text: '', tabId: tabId });
// chrome.action.setBadgeBackgroundColor({ color: '#000000', tabId: tabId });
