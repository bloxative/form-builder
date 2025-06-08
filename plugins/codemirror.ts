import Codemirror from 'vue-codemirror';
import {
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers
} from '@codemirror/view';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { vsCodeDark } from '@fsegurai/codemirror-theme-vscode-dark';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Codemirror, {
    autoFocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    extensions: [
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      drawSelection(),
      bracketMatching(),
      indentOnInput(),
      history(),
      autocompletion(),
      vsCodeDark
    ]
  });
});
