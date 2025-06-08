chrome.webNavigation.onCompleted.addListener(async (details) => {
  const badge = await chrome.action.getBadgeText({tabId: details.tabId});
  chrome.action.setBadgeText({text: "OFF"});
});

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({tabId: tab.id});
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  const state = nextState === 'ON' ? true : false;  
  chrome.action.setBadgeText({tabId: tab.id, text: nextState});
  // console.log("Prev: "+ prevState +" Next: "+nextState);


    // chrome.tabs.sendMessage(tab.id, {action:"ping"}, function(response) {
    //   if (chrome.runtime.lastError) {
    //     console.warn("Error sending message:", chrome.runtime.lastError.message);
    //     // Handle the error gracefully, e.g., retry or inform the user.
    //     chrome.scripting.executeScript({
    //       target: {tabId: tab.id},
    //       files: ['./content-scripts/main.js'],
    //     });
    //     chrome.scripting.insertCSS({
    //       target: {tabId: tab.id},
    //       files: ['./styles/content-styles.css'],
    //     });
    //   } else {
    //     // Process the response
    //     console.log("ping: ",response.result.status, response.result.message);
    //     chrome.tabs.sendMessage(tab.id, {action:"controls", state: state}, function(response) {
    //       console.log("Respuesta del Content Script:", response);
    //     });
    //   }
    // });
    chrome.tabs.sendMessage(tab.id, {action:"controls", state: state}, function(response) {
          console.log("Respuesta del Content Script:", response);
    });


});


