import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

function EditorCM() {
  const editorRef = useRef();

  useEffect(()=>{
   
  },[]);
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
        console.log("value:", value);
      }}
      autoCorrect="true"
      indentWithTab="true"
    />
  );
}

export default EditorCM;
