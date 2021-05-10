/**
 * default host value
 */
var host = "http://127.0.0.1:9666";
var pause = false;

/**
 * load settings from chrome
 */
chrome.storage.sync.get({
  targethost: '127.0.0.1',
  pause: false
}, function(items) {
    host = "http://" + items.targethost + ":9666";
    pause = items.pause;
    if (!pause)install_listener();
});

/**
 * Check URL for port 9666 and replace host
 * otherwise return original url
 * @param {*} details 
 */
function checkurl(details){
    if ( details.url.match(/^[\S]*:9666\//)  && !pause) {
        return { redirectUrl: host + details.url.match(/^([\S]*:9666)([\S]*)/)[2] };
    }
    return {redirectUrl: details.url };
}

/**
 * filter settings url
 */
var filter = {
    urls: [
        "*://127.0.0.1/*",
        "*://localhost/*"
    ],
    types: ["main_frame", "sub_frame", "script", "object", "xmlhttprequest"]
}

/**
 * install onBeforeRequestListener after settings are loaded
 */
function install_listener(){
    chrome.webRequest.onBeforeRequest.addListener( checkurl, filter, ["blocking"]);
}

/**
 * if paused remove onBeforeRequestListener
 */
 function remove_listener(){
    chrome.webRequest.onBeforeRequest.removeListener( checkurl );
}


/**
 * save pause state
 * @param {boolean} pause must be set to true or false 
 */
// Saves options to chrome.storage.sync.
function save_options(pause, callback) {
  chrome.storage.sync.set({
    pause: pause
  }, function() {
    // Update icon status
    callback();
  });
}


/**
 * set extension icon to pause state
 */
function disableBrowserAction(){
    chrome.browserAction.setIcon({path:"images/icon_status_pause.png"});
    remove_listener();
}
/**
 * set extension icon to normal state
 */
function enableBrowserAction(){
    chrome.browserAction.setIcon({path:"images/icon_status.png"});
    install_listener();
}

/**
 * on click handler for extension icon
 * switch state, store and update icon
 */
function updateState( ){
    
        if(pause == false){
            pause = true;
            save_options(pause,function(){
                disableBrowserAction();
            });
        }else{
            pause = false;
            save_options(pause,function(){
                enableBrowserAction();
            });   
        }
}

/**
 * register extension icon on click handler
 */
chrome.browserAction.onClicked.addListener(updateState);