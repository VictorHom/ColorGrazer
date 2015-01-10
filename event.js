// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod (tab, method, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
  });
}

function getBgColors (tab) {
injectedMethod(tab, 'getBgColors', function (response) {
    var colors = response.data;
    if (colors && colors.length) {
      
    } else {
      alert('No background colors were found! :(');
    }
    return true;
  })
}

chrome.browserAction.onClicked.addListener(function(tab){
  getBgColors(tab);
});