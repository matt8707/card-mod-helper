// Sample JS path
const sample = () => {
  let sample = 'document.querySelector("body > home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root").shadowRoot.querySelector("#view > hui-view > hui-masonry-view").shadowRoot.querySelector("#columns > div > hui-entities-card").shadowRoot.querySelector("ha-card")';
  document.getElementById("forminput").value = sample;
};

// Process
const process = () => {
    let forminput = document.getElementById("forminput").value;

    // Identify type
    let card_mod_type = document.getElementById("card-mod-type");
    card_mod_type.innerHTML = "";

    if (forminput.includes("#layout > app-header")) {
      card_mod_type.innerHTML += "card-mod-root-yaml: |";
    } else if (forminput.includes("#view > hui-view")) {
      card_mod_type.innerHTML += "card-mod-view-yaml: |";
    } else if (forminput.includes("card-tools-popup")) {
      card_mod_type.innerHTML += "card-mod-more-info-yaml: |";
    } else {
      card_mod_type.innerHTML += "card-mod-???";
    }

    let input = forminput.includes("card-tools-popup") ? 
      forminput.replaceAll("document.querySelector(\"body > home-assistant\").shadowRoot.querySelector(\"card-tools-popup\").shadowRoot.", "") : 
      forminput.replaceAll("document.querySelector(\"body > home-assistant\").shadowRoot.querySelector(\"home-assistant-main\").shadowRoot.querySelector(\"app-drawer-layout > partial-panel-resolver > ha-panel-lovelace\").shadowRoot.querySelector(\"hui-root\").shadowRoot.", "");

    // Replace JS path
    let js_path = input
      .replaceAll("document.", "")
      .replaceAll('querySelector("', "")
      .replaceAll(" ", "")
      .replaceAll('")', "")
      .replaceAll(">", "&gt;")
      .replaceAll(".shadowRoot.", "&#36;");

    // Root
    let root = js_path
      .replaceAll("body>home-assistant&#36;home-assistant-main&#36;app-drawer-layout>partial-panel-resolver>ha-panel-lovelace&#36;hui-root&#36;")
      .replaceAll("&#36;", "<span class=\"shadowroot\">&#36;</span>")
      .replaceAll("&gt;", "<span class=\"combinator\">&gt;</span>");

    // Output
    let outputroot = document.getElementById("outputroot");
    outputroot.innerHTML = "";
    if (forminput.includes("document.querySelector(\"body > home-assistant\").shadowRoot.")) {
      outputroot.innerHTML += "\"" + root + "\"";
    } else {
      outputroot.innerHTML += "<span id=\"error\">Invalid JS path</span>";
    }
};

// Copy output
const copy = () => {
  if (outputroot.innerHTML == "&nbsp;" || outputroot.innerHTML == "<span id=\"error\">Invalid JS path</span>") {} else {
    const elm = document.getElementById("outputroot");
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(elm);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy");
      window.getSelection().removeAllRanges();

      // Button animation
      document.getElementById("copy").classList.add("flash");
      window.setTimeout(() => {
        document.getElementById("copy").classList.remove("flash");
      }, 800);
    }
  }
};

// Paste output
const paste = () => {
navigator.clipboard.readText()
  .then(text => {
    document.getElementById("forminput").value = text;
    process();
    copy();
  })
  .catch(() => {
    document.getElementById("forminput").value = "";
  });
};
