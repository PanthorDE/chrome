function save_options() {
  chrome.storage.sync.set({
    phabToken: document.getElementById('inputToken').value
  }, function() {
    document.getElementById('inputToken').className = "form-control is-valid";
    setTimeout(function() {
      document.getElementById('inputToken').className = "form-control";
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    phabToken: '',
  }, function(items) {
    document.getElementById('inputToken').value = items.phabToken;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);