const convertPath = () => {
  //define elements
  let input = document.getElementById("input"),
    output = document.getElementById("output"),
    card_mod_type = document.getElementById("card-mod-type");

  // set output type
  card_mod_type.innerHTML = getType(input);

  // run replace
  replacePath(input, output);
};

const getType = (input) => {
  // supported types
  let types = {
    "card-mod-root-yaml": "#layout > app-header",
    "card-mod-view-yaml": "#view > hui-view",
    "card-mod-sidebar-yaml": `#drawer > ha-sidebar").shadowRoot.`,
    "card-mod-more-info-yaml": "body > browser-mod-popup",
  };

  // return type
  for (let [type, path] of Object.entries(types)) {
    if (input.value.includes(path)) {
      return `${type}: |`;
    }
  }
  // else return unknown
  return `<span id="error">card-mod-???</span>`;
};

const replacePath = (input, output) => {
  // replace with nothing
  let x = "";

  // is js path more-info
  let js_path = input.value.includes("browser-mod-popup")
    ? input.value.replaceAll(
        `document.querySelector("body > browser-mod-popup").shadowRoot.`,
        x
      )
    : input.value
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

  // reset
  output.innerHTML = x;

  // output converted path
  if (
    input.value.includes(
      `document.querySelector("body > home-assistant").shadowRoot.`
    ) ||
    input.value.includes(
      `document.querySelector("body > browser-mod-popup").shadowRoot.`
    )
  ) {
    output.innerHTML += `"${replace_char}"`;

    // handle invalid path
  } else {
    output.innerHTML += `<span id="error">Invalid JS path</span>`;
  }
};

const samplePath = () => {
  // define sample path
  let sample = `document.querySelector("body > home-assistant")\.shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("app-drawer-layout > partial-panel-resolver > ha-panel-lovelace").shadowRoot.querySelector("hui-root").shadowRoot.querySelector("#view > hui-view > hui-masonry-view").shadowRoot.querySelector("#columns > div > hui-entities-card").shadowRoot.querySelector("ha-card")`;

  // set sample path
  document.getElementById("input").value = sample;
};

const copyPath = () => {
  let output = document.getElementById("output"),
    copy = document.getElementById("copy");

  if (
    output.innerHTML == "&nbsp;" ||
    output.innerHTML == `<span id="error">Invalid JS path</span>`
  ) {
    return;
  } else {
    if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(output);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      window.getSelection().removeAllRanges();

      // button animation
      copy.classList.add("flash");
      window.setTimeout(() => {
        copy.classList.remove("flash");
      }, 800);
    }
  }
};

const pastePath = () => {
  let input = document.getElementById("input");
  navigator.clipboard
    .readText()
    .then((text) => {
      input.value = text;
      convertPath();
      copyPath();
    })
    .catch(() => {
      input.value = "";
    });
};
