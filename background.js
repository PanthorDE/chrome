openPanelID = function (id) {
  chrome.tabs.create({url: 'https://support.panthor.de/db/player/' + id})
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'open-panel',
    title: 'Panel öffnen',
    contexts: ['selection']
  })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'open-panel') {
    openPanelID(info.selectionText)
  }
})