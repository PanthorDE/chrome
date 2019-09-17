function retrieveWindowVariables (variables) {
  var ret = {}

  var scriptContent = ''
  for (var i = 0; i < variables.length; i++) {
    var currVariable = variables[i]
    scriptContent += 'if (typeof ' + currVariable + ' !== \'undefined\') $(\'body\').attr(\'tmp_' + currVariable + '\', JSON.stringify(' + currVariable + '));\n'
  }

  var script = document.createElement('script')
  script.id = 'tmpScript'
  script.appendChild(document.createTextNode(scriptContent));
  (document.body || document.head || document.documentElement).appendChild(script)

  for (var i = 0; i < variables.length; i++) {
    var currVariable = variables[i]
    ret[currVariable] = $.parseJSON($('body').attr('tmp_' + currVariable))
    $('body').removeAttr('tmp_' + currVariable)
  }

  $('#tmpScript').remove()

  return ret
}

var windowVariables = retrieveWindowVariables(['SECURITY_TOKEN'])

var span1 = document.createElement('span')
span1.className = 'icon icon16 fa-bug'

var span2 = document.createElement('span')
span2.innerHTML = 'In Bugtracker verschieben'

var button = document.createElement('a')
button.title = 'In Bugtracker verschieben'
button.className = 'button'

var li = document.createElement('li')

var ul = document.createElement('ul')
ul.className = 'jsIssueInlineEditorContainer'

var section = document.createElement('section')
section.className = 'box'

var div = document.createElement('div')
div.className = 'boxContainer'

button.appendChild(span1)
button.appendChild(span2)

//

var span21 = document.createElement('span')
span21.className = 'icon icon16 fa-bug'

var span22 = document.createElement('span')
span22.innerHTML = 'Schließen und Erledigt'

var button2 = document.createElement('a')
button2.title = 'Schließen und Erledigt'
button2.className = 'button'

var li2 = document.createElement('li')

var ul2 = document.createElement('ul')
ul2.className = 'jsIssueInlineEditorContainer'

var section2 = document.createElement('section')
section2.className = 'box'

button2.appendChild(span21)
button2.appendChild(span22)

//
var span31 = document.createElement('span')
span31.className = 'icon icon16 fa-bug'

var span32 = document.createElement('span')
span32.innerHTML = 'Erledigt'

var button3 = document.createElement('a')
button3.title = 'Erledigt'
button3.className = 'button'

var li3 = document.createElement('li')

var ul3 = document.createElement('ul')
ul3.className = 'jsIssueInlineEditorContainer'

var section3 = document.createElement('section')
section3.className = 'box'

button3.appendChild(span31)
button3.appendChild(span32)


var phabToken = ''
chrome.storage.sync.get({
  phabToken: '',
}, function (items) {
  phabToken = items.phabToken
})

var projects = ['PHID-PROJ-4k4rqsqjbqdv7fqoxuvb', 'PHID-PROJ-r2yn6f5dx2uuwzrgw32b']

if ($('li[title="ReallifeRPG 6.0 Terrain"]').length > 0) {
  projects = ['PHID-PROJ-g7ty4gmdltr3jqxgn4xc', 'PHID-PROJ-r2yn6f5dx2uuwzrgw32b']
}
if ($('li[title="ReallifeRPG 6.0 Mods"]').length > 0) {
  projects = ['PHID-PROJ-qhtqoxq6tpijwnwgaspm', 'PHID-PROJ-r2yn6f5dx2uuwzrgw32b']
}

button.addEventListener('click', function () {
  var col_wrapper = document.getElementsByClassName('wpbtCommentDeleted')
  var len = col_wrapper.length

  for (var i = 0; i < len; i++) {
    if (col_wrapper[i].className.toLowerCase().indexOf('wpbtCommentDeleted')) {
      col_wrapper[i].parentNode.removeChild(col_wrapper[i])
    }
  }

  var images = document.getElementsByTagName('img')
  var l = images.length
  for (var i = 0; i < l; i++) {
    images[0].parentNode.removeChild(images[0])
  }

  var links = document.getElementsByClassName('embeddedAttachmentLink')
  for (var i = 0; i < links.length; i++) {
    links[i].innerHTML = 'Image '
    links[i].removeAttribute('title')
  }

  var msgheader = document.getElementsByClassName('messageHeaderMetaData')
  for (var i = 0; i < msgheader.length; i++) {
    msgheader[i].prepend("(NOTE)")
  }

  document.getElementsByClassName('messageHeaderMetaData')[1]

  var title = document.getElementsByClassName('contentTitle')[0].innerHTML
  var desc = document.getElementsByClassName('contentDesctription')[0].innerHTML
  var body = document.getElementsByClassName('htmlContent')[0].innerHTML
  var header = document.getElementsByClassName('contentHeaderMetaData')[0].innerHTML
  var msg_header = document.getElementsByClassName('messageHeaderWrapper')
  var msg_body = document.getElementsByClassName('messageText')
  var issue_id = document.getElementsByClassName('wpbtIssue')[0].dataset.issueId

  var turndownService = new TurndownService()
  var output = '<h2>' + title + '</h2><h4>' + desc + '</h4>(WARNING)' + header + body + '<h4>Kommentare</h4>'

  for (var i = 0; i < msg_header.length; i++) {
    msg_header[i].removeChild(msg_header[i].childNodes[0])
    msg_header[i].removeChild(msg_header[i].childNodes[0])
    output = output + msg_header[i].innerHTML + msg_body[i].innerHTML
  }
  var markdown = turndownService.turndown(output)
  $.ajax({
    type: 'POST',
    url: 'https://forum.realliferpg.de/wpbt/index.php?ajax-proxy/&t=' + windowVariables.SECURITY_TOKEN,
    dataType: 'json',
    responseType: 'application/json',
    data: {
      actionName: 'saveEdit',
      className: 'wpbt\\data\\issue\\IssueAction',
      'parameters[data][values][default][isClosed]': 1,
      'parameters[data][values][default][statusID]': 2,
      'parameters[data][issueID]': issue_id
    }
  })
  chrome.runtime.sendMessage({
    schema: "phab",
    type: 'POST',
    url: 'https://api.realliferpg.de/v1/forwardPhab',
    data: {
      'api.token': phabToken,
      'transactions': [
        {
          'type': 'title',
          'value': title
        },
        {
          'type': 'description',
          'value': markdown
        },
        {
          'type': 'priority',
          'value': 'normal'
        },
        {
          'type': 'edit',
          'value': 'PHID-PLCY-qitajc4gubgsjghdn2sa'
        },
        {
          'type': 'projects.set',
          'value': projects
        }
      ]
    },

  })
}, false)

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log(msg)
  postRespone(msg.data)
});

function postRespone (data) {
  var issue_id = document.getElementsByClassName('wpbtIssue')[0].dataset.issueId
  $.ajax({
    type: 'POST',
    url: 'https://forum.realliferpg.de/wpbt/index.php?ajax-proxy/&t=' + windowVariables.SECURITY_TOKEN,
    dataType: 'json',
    responseType: 'application/json',
    data: {
      actionName: 'quickReply',
      className: 'wpbt\\data\\comment\\CommentAction',
      interfaceName: 'wcf\\data\\IMessageQuickReplyAction',
      'parameters[lastPostTime]': Date.now(),
      'parameters[pageNo]': 1,
      'parameters[anchor]:': '',
      'parameters[sortOrder]': 'ASC',
      'parameters[data][tmpHash]': '',
      'parameters[objectID]': issue_id,
      'parameters[data][message]': '<p>Bug wurde in den Bugtracker übernommen: <a href=\'https://bugs.realliferpg.de/T' + data.data.result.object.id + '\'>T' + data.data.result.object.id + '</a> </p>',
    }
  })
  window.location.href = "https://bugs.realliferpg.de/T" + data.data.result.object.id
}

button2.addEventListener('click', function () {
  var issue_id = document.getElementsByClassName('wpbtIssue')[0].dataset.issueId
  $.ajax({
    type: 'POST',
    url: 'https://forum.realliferpg.de/wpbt/index.php?ajax-proxy/&t=' + windowVariables.SECURITY_TOKEN,
    dataType: 'json',
    responseType: 'application/json',
    data: {
      actionName: 'saveEdit',
      className: 'wpbt\\data\\issue\\IssueAction',
      'parameters[data][values][default][isClosed]': 1,
      'parameters[data][values][default][statusID]': 2,
      'parameters[data][issueID]': issue_id
    },
    success: function () {
      location.reload()
    }
  })
}, false)

button3.addEventListener('click', function () {
  var issue_id = document.getElementsByClassName('wpbtIssue')[0].dataset.issueId
  $.ajax({
    type: 'POST',
    url: 'https://forum.realliferpg.de/wpbt/index.php?ajax-proxy/&t=' + windowVariables.SECURITY_TOKEN,
    dataType: 'json',
    responseType: 'application/json',
    data: {
      actionName: 'saveEdit',
      className: 'wpbt\\data\\issue\\IssueAction',
      'parameters[data][values][default][statusID]': 2,
      'parameters[data][issueID]': issue_id
    },
    success: function () {
      location.reload()
    }
  })
}, false)

li.appendChild(button)
ul.appendChild(li)
section.appendChild(ul)
div.appendChild(section)

li2.appendChild(button2)
ul2.appendChild(li2)
section2.appendChild(ul2)
div.appendChild(section2)

li3.appendChild(button3)
ul3.appendChild(li3)
section3.appendChild(ul3)
div.appendChild(section3)

document.getElementsByClassName('boxesSidebarRight')[0].appendChild(div)