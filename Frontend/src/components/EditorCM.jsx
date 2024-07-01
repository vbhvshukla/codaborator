import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import ACTIONS from "../../Actions";

function EditorCM({ socketRef, roomId }) {
  const editorRef = useRef();
  const [editorInstance, setEditorInstance] = useState(null);
  useEffect(() => {
    if (socketRef.current && editorInstance) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ value }) => {
        console.log(value);
        if (editorInstance) {
          editorInstance.dispatch({
            changes: {
              from: 0,
              to: editorInstance.state.doc.length,
              insert: value,
            },
          });
        }
      });
    } else {
      console.log("socketRef is null or editorInstance is not set");
    }
  }, [socketRef]);

  return (
    <CodeMirror
      ref={editorRef}
      value="console.log('hello world!');"
      className=""
      height="515px"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
      }}
      theme={vscodeDark}
      extensions={[javascript({ jsx: true })]}
      onChange={(value, viewUpdate) => {
        console.log(value);
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          value,
        });
      }}
      autoCorrect="true"
      onCreateEditor={(editor) => {
        setEditorInstance(editor);
      }}
      indentWithTab="true"
    />
  );
}

export default EditorCM;
