// Wrap your code with 'store' when you run it in the Firefox multi-line editor
// your code will be stored in localStorage.
function store(filename, userCode, silent) {
  if (typeof(filename) === "function") {
    userCode = filename;
    filename = "default.js";
  }
  const codeStr = userCode.toString(); 
  const code = codeStr.slice(codeStr.indexOf("{") + 1, codeStr.lastIndexOf("}")).trimStart();
	window.localStorage.setItem(`sandstorm:${filename}`, code);
  if (silent !== false) userCode();
}

// Call save() when on this page https://gist.github.com/ and files you've stored in localStorage
// will be added as new gist files.
function save() {
  if (window.location.href.includes("gist.github.com")) {

    const qs = s => document.querySelector(s);
		const qsa = s => document.querySelectorAll(s);
    
    const files = []; 
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key.indexOf("sandstorm:") === 0) {
        const fn = key.split(":")[1];
        const contents = window.localStorage.getItem(key);
        files.push({ filename: fn, contents });        
      }
    }
    
    const addFile = qs("button.js-add-gist-file");
    const removeFileButtons = qsa("button.js-remove-gist-file");

    for (let i = 0; i < removeFileButtons.length - 1; i++) {
      removeFileButtons[i].click();
    }
    
    for (let i = 0; i < files.length - 1; i++) {
      addFile.click();
    }
    
    setTimeout(() => {
      const codeEditors = qsa(".CodeMirror");
      const filenameInputs = qsa("input.js-blob-filename");

      codeEditors.forEach(e => {
        e.CodeMirror.setValue("");
      });

      files.forEach(({filename, contents}, i) => {
        filenameInputs[i].value = filename;
        codeEditors[i].CodeMirror.setValue(contents);
      });      
    }, 10);
  }
}

// Prints the contents of a file you have stored to the console.
function get(filename) {
  console.log(
  	window.localStorage.getItem(`sandstorm:${filename}`)
  );
}

store("test.js", () => { 
  function add(a, b) {
    return a + b;
  }
  console.log(add(1, 3) + add(2, 4));
}, false);

store("test_two.js", () => { 
  const text = "this is test two";
});

store("three.js", () => { 
  function main() {
    return "bills";
  } 
});

save();

get("three.js");
