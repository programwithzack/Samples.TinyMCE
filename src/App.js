import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const header =
    "<header contenteditable='false'><div style='height: 200px; font-size: 28px'>Header Section</div></header>";
  const footer =
    "<footer contenteditable='false'><div style='height: 200px; font-size: 28px'>Footer Section</div></footer>";
  const initialValue = `${header}<p>Type content here...</p>${footer}`;
  return (
    <>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        init={{
          height: 800,
          menubar: false,
          inline_styles: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat remove | metadata ",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          setup: function (editor) {
            editor.ui.registry.addMenuButton("metadata", {
              tooltip: "Insert Attribute",
              icon: "comment-add",
              fetch: function (callback) {
                var items = [
                  {
                    type: "menuitem",
                    text: "Name",
                    onAction: function () {
                      editor.insertContent(
                        '<span contenteditable="false" style="color: black; font-weight: bold; background-color: #e7f0f7" class="placeholder ui-draggable" unselectable="ON">[Person Name]</span>'
                      );
                    },
                  },
                  {
                    type: "menuitem",
                    text: "Email",
                    onAction: function () {
                      editor.insertContent(
                        '<span contenteditable="false" style="color: black; font-weight: bold; background-color: #e7f0f7" class="placeholder ui-draggable" unselectable="ON">[Person Email]</span>'
                      );
                    },
                  },
                ];
                callback(items);
              },
            });
          },
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}
