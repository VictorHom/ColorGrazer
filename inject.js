// This helps avoid conflicts in case we inject 
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  // This method will eventually return
  // background colors from the current page.
  methods.getBgColors = function(){
  // Stores the colors and the number of occurrences
  var colors = {};
  // Get all the nodes on a page

  var nodes = document.querySelectorAll('*');
  var node, nodeArea, bgColor, i;

  // Loop through all the nodes
  for (i = 0; i < nodes.length; i++) {
    // The current node
    node = nodes[i];
    // The area in pixels occupied by the element
    nodeArea = node.clientWidth * node.clientHeight;
    // The computed background-color value
    bgColor = window.getComputedStyle(node)['background-color'];
    // Strip spaces from the color for succinctness
    bgColor = bgColor.replace(/ /g, '');
    // If the color is not white or fully transparent...
    if (
      bgColor != 'rgb(255,255,255)' &&
      !(bgColor.indexOf('rgba') === 0 && bgColor.substr(-3) === ',0)')
    ) {
      // ...set or override it in the colors object,
      // adding the current element area to the
      // existing value.
      colors[bgColor] = (colors[bgColor] >> 0) + nodeArea;
    }
  }

  // Sort and return the colors by
  // total area descending
  return Object.getOwnPropertyNames(colors).sort(function (a, b) {
    return colors[b] - colors[a];
  });
  };

  // This tells the script to listen for
  // messages from our extension.
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};

    //check if it exists already
    if ($("#colorcontainer").length > 0){
      return;
    }

    //the node in which the popup is formed 
    var colorcontainer = $("<div id='colorcontainer'></div>");
    $("body").prepend(colorcontainer);
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();

    for(var i = 0; i < data.length; i++){
      var hexValues = data[i].slice(data[i].indexOf("(")+1, data.indexOf(")")).split(",");
      if (hexValues.length > 3){
        //get rid of fourth value if there is transparency
        hexValues = hexValues.splice(3,1);
      }
      for (var j = 0; j < hexValues.length; j++){
        //getting the hex from the rgb values
        hexValues[j] = parseInt(hexValues[j]).toString(16);
      }
      hexValues = "#" +hexValues.join('');
      var node = "<textarea class='colortext'>" +  data[i] + "/ "+ hexValues +
       "</textarea><div class = 'colordivs' style='background-color: " + data[i] + "' ></div>";
      colorcontainer.append(node);
    }
    //popup effect
    // colorcontainer.popup({
    //     content   : colorcontainer ,
    //     width : 300,
    //     height : 300
    // });
    // colorcontainer.trigger('click');
    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();

