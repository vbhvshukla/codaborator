import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import ACTIONS from "../../Actions";

function EditorCM({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [code, setCode] = useState("");
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ value }) => {
        setCode(value);
        onCodeChange(value);
        // onCodeChange(value); //For auto Sync
        return () => {
          socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
      });
    } else {
      console.log("SocketRef is null");
    }
  }, [socketRef.current, editorInstance]);

  return (
    <>
      <CodeMirror
        ref={editorRef}
        value={code}
        placeholder={"Enter something!"}
        className=""
        height="515px"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
        }}
        theme={vscodeDark}
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          
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
    </>
  );
}

export default EditorCM;
