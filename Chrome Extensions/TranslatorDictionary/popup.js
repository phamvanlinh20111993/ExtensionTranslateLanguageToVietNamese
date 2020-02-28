
document.addEventListener('DOMContentLoaded', function (event) {

  let inputTyping = document.getElementById('checkValueTyping');
  // event 
  chrome.runtime.getBackgroundPage(function (bg) {
    chrome.storage.sync.get(['chooseText'], function (items) {
      if (items.chooseText) {
        inputTyping.value = items.chooseText;
        chrome.storage.sync.remove(['chooseText'], function (Items) { });
      } else {
        inputTyping.value = '';
      }
    });

  });

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    console.log('active tab', tab.title)
  });

  inputTyping.addEventListener('click', function (e) {
    chrome.tabs.getSelected(null, function (tab) {
      d = document;
      console.log(e.target.value)
      // var f = d.createElement('form');
      // f.action = 'https://facebook.com';
      // f.method = 'post';
      // var i = d.createElement('input');
      // i.type = 'text';
      // i.name = 'url';
      // i.value = tab.url;
      // f.appendChild(i);
      // d.body.appendChild(f);
      // f.submit();
    });
  }, false);

  inputTyping.addEventListener('keyup', function (e) {
    e.preventDefault();
    let x = e.which || e.keyCode;
    if (x == 13) {
      //   alert('you enter value' + e.target.value)
    }
  }, false);

}, false);

