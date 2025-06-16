(()=>{

  //inicializa el control flotante en la pagina actual
  const hlr = new Hihglighter(document.body, { color: "#ff00c850" });
  let firstRun = true;
  const markerIcon = `<svg  xmlns=" viewBox="0 0 24 24"  fill="var(--high-hover)"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>`;

  const floatingControls = ` <div class="floating-highlighter hidden">

      <input type="radio" id="Digit5" name="color" class="marker-control" value="#ff00c850" checked>
      <label for="Digit5" class="color-label marker-label icon" style="--high-color:#ff00c850; --high-hover:#ff00c8;"><span>${markerIcon}</span></label>

      <input type="radio" id="Digit1" name="color" class="marker-control" value="#ff000050">
      <label for="Digit1" class="color-label marker-label icon" style="--high-color:#ff000050; --high-hover:#ff0000;"><span>${markerIcon}</span></label>

      <input type="radio" id="Digit2" name="color" class="marker-control" value="#00ff0050">
      <label for="Digit2" class="color-label marker-label icon" style="--high-color:#00ff0050; --high-hover:#00ff00;"><span>${markerIcon}</span></label>

      <input type="radio" id="Digit3" name="color" class="marker-control" value="#0000ff50">
      <label for="Digit3" class="color-label marker-label icon" style="--high-color:#0000ff50; --high-hover:#0000ff;"><span>${markerIcon}</span></label>

      <input type="radio" id="Digit4" name="color" class="marker-control" value="#ffff0050">
      <label for="Digit4" class="color-label marker-label icon" style="--high-color:#ffff0050; --high-hover:#ffff00;"><span>${markerIcon}</span></label>

      <input type="radio" id="Digit6" name="color" class="marker-control" value="#9900ff50">
      <label for="Digit6" class="color-label marker-label icon" style="--high-color:#9900ff50; --high-hover:#9900ff;"><span>${markerIcon}</span></label>

      <!-- -->

      <input type="checkbox" id="eraser" class="tool-control" name="enabled" value="#00000010">
      <label for="eraser" class="tool-label icon" style="--high-color:transparent; --high-hover:#000;">
        <span>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eraser-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l5 -4.993m2.009 -2.01l3 -3a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41c-1.417 1.431 -2.406 2.432 -2.97 3m-2.02 2.043l-4.211 4.256" /><path d="M18 13.3l-6.3 -6.3" /></svg>
        </span>
        <span>
          <svg width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eraser"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" /><path d="M18 13.3l-6.3 -6.3" /></svg>
        </span>
      </label>

      <input type="checkbox" id="watcher" class="tool-control" name="watcher" value="#00000010" checked>
      <label for="watcher" class="tool-label icon" style="--high-color:transparent; --high-hover:#000;">
      <span>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>
      </span>
      <span>  
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
      </span>
      </label>

      <input type="checkbox" id="power" class="tool-control" name="power" value="#00000010" checked>
      <label for="power" class="tool-label icon" style="--high-color:transparent; --high-hover:#000;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-power"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M7 6a7.75 7.75 0 1 0 10 0"/> <path d="M 22.135 4 C 18.135 7.007 2.597 20.259 2.543 20.251"/> <path d="M12 4l0 8"/></svg>
      </span>
        <span> 
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-power"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 6a7.75 7.75 0 1 0 10 0" /><path d="M12 4l0 8" /></svg>
        </span>
      </label>
    </div>`;

  document.documentElement.insertAdjacentHTML("beforeend", floatingControls);

  document.addEventListener("change", e => {
    //enable/disable highlighter
    if (e.target.matches("#power")) {
      if (e.target.checked)
        hlr.runHighlighter();
      else
        hlr.stopHighlighter();
    }

    //get marker color
    if (e.target.matches(".marker-control"))
      hlr.setColor(e.target.value);

    //enable/disable eraser
    if (e.target.matches("#eraser")) {
      if (e.target.checked){
        document.querySelectorAll(".highlighted").forEach(el=>el.classList.add("highlighted-eraser"));
        hlr.runEraser();
      }
      else{
        document.querySelectorAll(".highlighted").forEach(el=>el.classList.remove("highlighted-eraser"));
        hlr.stopEraser();
      }
    }
    
    //show/hide highlights
    if (e.target.matches("#watcher")) {
      if (e.target.checked)
        hlr.showHighlights();
      else
        hlr.hideHighlights();
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // en lugar de usar el action, utilizar el state del request recibido desde el popup
    // utilizar el state para restablecer los estilos de la pseudoclase ::selection
    // y desactivar el resaltado de texto
    if (request.action === "controls") {
      console.log("content script request received:", request);
      if (request.state) {
        if(firstRun){
          hlr.initHighlights();
          firstRun = false;
        }
        hlr.runHighlighter();
        hlr.showHighlights();
        // showControls(request.state)
        document.querySelector(".floating-highlighter").classList.remove("hidden");
      }
      else {
        // showControls(request.state)
        hlr.stopHighlighter();
        hlr.hideHighlights();
        document.querySelector(".floating-highlighter").classList.add("hidden");
      }
      sendResponse({ result: { status: true, message: "floating controls updated" } });
    }
    return true;
  });


})()