import {addTypeChecks} from "@runtime-type-inspector/transpiler";
import * as rtiTranspiler from "@runtime-type-inspector/transpiler";
/**
 * @param {string} id - ID of editor.
 * @param {string} txt - Initial text of editor.
 * @param {Function} execShiftEnter - Function for Shift+Enter
 * @param {Function} execAltEnter - Function for Alt+Enter
 * @returns {ACE.Editor} The ACE editor.
 */
function setupAce(id, txt, execShiftEnter, execAltEnter) {
  const aceEditor = ace.edit(id);
  aceEditor.setFontSize(20);
  //aceEditor.setTheme('ace/theme/chrome');
  aceEditor.setTheme('ace/theme/ambiance');
  aceEditor.session.setMode('ace/mode/javascript');
  aceEditor.session.setUseWorker(false);
  aceEditor.session.setOptions({
    tabSize: 2,
    useSoftTabs: true
  });
  aceEditor.setValue(txt);
  aceEditor.clearSelection(); // setValue() selects everything, so unselect it now
  aceEditor.commands.addCommand({
    name: 'Insert types',
    bindKey: {win: 'Shift-Enter', mac: 'Shift-Enter'},
    exec: execShiftEnter
  });
  aceEditor.commands.addCommand({
    name: 'Show AST',
    bindKey: {win: 'Alt-Enter', mac: 'Alt-Enter'},
    exec: execAltEnter
  });
  return aceEditor;
}
const example = `/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
  return a + b;
}
/** @type {number[]} */
const arr = [10_20];
const [a, b] = arr;
const ret = add(a, b);
console.log("ret", ret);
`;
const aceEditorLeft   = setupAce("playground-in", example, console.log, console.log);
const aceEditorRight = setupAce("playground-out", "hello out", console.log, console.log);
function onChange() {
    const val = aceEditorLeft.getValue();
    const valRight = addTypeChecks(val);
    aceEditorRight.setValue(valRight);
    aceEditorRight.clearSelection(); // setValue selects everything
}
onChange(); // initial update
aceEditorLeft.on('change', onChange);
Object.assign(window, {
    addTypeChecks, aceEditorLeft, aceEditorRight, rtiTranspiler, ...rtiTranspiler
});

// <x-code>: single-tag code area. Register it (styling works regardless,
// but defining it is proper) and inject a copy button into each instance
// so the HTML needs no extra markup at all.
customElements.define("x-code", class extends HTMLElement {});

// Copy buttons: injected into every <x-code> so the HTML stays clean.
// Click copies the block, button briefly confirms with "copied ✓".
for (const el of document.querySelectorAll("x-code")) {
    const text = el.textContent.trim();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            return; // clipboard unavailable — stay quiet, text is still selectable
        }
        btn.textContent = "copied ✓";
        btn.classList.add("copied");
        setTimeout(() => {
            btn.textContent = "copy";
            btn.classList.remove("copied");
        }, 1200);
    });
    el.append(btn);
}
