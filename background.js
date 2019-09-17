openPanelID = function (id) {
  chrome.tabs.create({url: 'https://support.realliferpg.de/db/player/' + id})
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'open-panel',
    title: 'Panel öffnen',
    contexts: ['selection']
  })
})

chrome.contextMenus.create({
  id: 'open-panel',
  title: 'Panel öffnen',
  contexts: ['selection']
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'open-panel') {
    openPanelID(info.selectionText)
  }
})

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request, sender)
    switch (request.schema) {
      case 'phab':
        $.ajax({
          type: request.type,
          url: request.url,
          data: request.data,
          success: function (data) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {action: 'phab-data', data: data}, function (response) {})
            })
          }
        })
    }
  })

