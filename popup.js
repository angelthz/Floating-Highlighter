(() => {
  const switcher = document.getElementById("switch");
  //no hay comunicion del background al content script background-->script
  //es decir, el background no puede enviar mensajes al content script
  //sin embargo el popup SI PUEDE enviar mensajes al content script
  //y mediante la respuesta del background es como podemos enviar
  //un mensaje del background al popup
  // popop msg --> background response <--- content script lee la respuesta

  chrome.runtime.sendMessage({ action : "tabId", message: "The active tab id" }, (response) => {
    console.log("PU request result:", response.result);
  });
  
  

  switcher.addEventListener("change", () => {
    // esto se puede refactorizar
    chrome.runtime.sendMessage({ 
      action : "highlighterState", 
      state: switcher.checked,
      message: "show or hide the floating controls", 
    }, (response) => {
            console.log("PU request result:", response.result);
    });
  }); 
  
})();