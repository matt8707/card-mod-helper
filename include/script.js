const process = () => {
  // define elements
  let forminput = document.getElementById("forminput").value,
    card_mod_type = document.getElementById("card-mod-type");

  // set output type
  card_mod_type.innerHTML = getType(forminput);

  // run replace
  replacePath(forminput);
};

const getType = (forminput) => {
  // supported types
  let types = {
    "card-mod-root-yaml": "#layout > app-header",
    "card-mod-view-yaml": "#view > hui-view",
    "card-mod-sidebar-yaml": "#drawer > ha-sidebar",
    "card-mod-more-info-yaml": "card-tools-popup",
  };

  // return type
  for (let [type, path] of Object.entries(types)) {
    if (forminput.includes(path)) {
      return `${type}: |`;
    }
  }
  // else return unknown
  return `card-mod-???`;
};

const replacePath = (forminput) => {
  // replace with nothing
  let x = "";

  // is js path more-info
  let js_path = forminput.includes("card-tools-popup")
    ? forminput.replaceAll(
        `document.querySelector("body > home-assistant").shadowRoot.querySelector("card-tools-popup").shadowRoot.`,
        x
      )
    : forminput
        .replaceAll(
          `document.querySelector("body > home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root").shadowRoot.`,
          x
        )
        .replaceAll(
          `document.querySelector("body > home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("#drawer > ha-sidebar").shadowRoot.`,
          x
        );

  // replace characters
  let replace_char = js_path
    .replaceAll(`document.`, x)
    .replaceAll(`querySelector("`, x)
    .replaceAll(`")`, x)
    .replaceAll(` `, x)
    .replaceAll(`>`, `<span class="combinator">&gt;</span>`)
    .replaceAll(`.shadowRoot.`, `<span class="shadowroot">&#36;</span>`);

  // define output element
  let output = document.getElementById("outputroot");

  // reset
  outputroot.innerHTML = x;

  // output converted path
  if (
    forminput.includes(
      `document.querySelector("body > home-assistant").shadowRoot.`
    )
  ) {
    output.innerHTML += `"${replace_char}"`;

    // handle invalid path
  } else {
    output.innerHTML += `<span id="error">Invalid JS path</span>`;
  }
};

const sample = () => {
  // define sample path
  let sample = `document.querySelector("body > home-assistant")\.shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root").shadowRoot.querySelector("#view > hui-view > hui-masonry-view").shadowRoot.querySelector("#columns > div > hui-entities-card").shadowRoot.querySelector("ha-card")`;

  // set sample path
  document.getElementById("forminput").value = sample;
};

const copy = () => {
  if (
    outputroot.innerHTML == "&nbsp;" ||
    outputroot.innerHTML == `<span id="error">Invalid JS path</span>`
  ) {
    return;
  } else {
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("outputroot"));
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();

      // button animation
      document.getElementById("copy").classList.add("flash");
      window.setTimeout(() => {
        document.getElementById("copy").classList.remove("flash");
      }, 800);
    }
  }
};

const paste = () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      document.getElementById("forminput").value = text;
      process();
      copy();
    })
    .catch(() => {
      document.getElementById("forminput").value = "";
    });
};
