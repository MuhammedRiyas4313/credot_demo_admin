"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// import ReactQuill from 'react-quill'
// const ReactQuill = dynamic(import('react-quill'), { ssr: false })

import "react-quill/dist/quill.snow.css";

export default function ReactQuillUtil({ value, setterFunction, placeholder }) {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
  let toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ];

  return (
    <>
      {/* <QuillToolbar /> */}
      <ReactQuill
        // modules={modules}
        // formats={formats}
        theme="snow"
        options={toolbarOptions}
        value={value}
        onChange={setterFunction}
        placeholder={placeholder}
      />
    </>
  );
}
