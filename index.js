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
const aceEditorLeft   = setupAce("hero-repl-in", example, console.log, console.log);
const aceEditorRight = setupAce("hero-repl-out", "hello out", console.log, console.log);
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
