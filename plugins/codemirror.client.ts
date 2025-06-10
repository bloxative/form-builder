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
import { jsonSchema } from 'codemirror-json-schema';
import { vsCodeDark } from '@fsegurai/codemirror-theme-vscode-dark';
import { formBuilderSchema } from '~/schemas/form-builder.schema';

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
      jsonSchema(formBuilderSchema),
      vsCodeDark
    ]
  });
});
