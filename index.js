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

setupAce("hero-repl-in", "hello", console.log, console.log);
setupAce("hero-repl-out", "hello out", console.log, console.log);
