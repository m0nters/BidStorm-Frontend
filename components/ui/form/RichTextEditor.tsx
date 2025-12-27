"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  error,
  disabled = false,
}: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div
      className={`prose prose-sm max-w-none overflow-hidden rounded-lg border ${error ? "border-red-500" : "border-gray-300"}`}
    >
      <Editor
        apiKey={apiKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={onChange}
        disabled={disabled}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            "advlist",
            "anchor",
            "autolink",
            "charmap",
            "code",
            "fullscreen",
            "help",
            "image",
            "insertdatetime",
            "link",
            "lists",
            "media",
            "preview",
            "searchreplace",
            "table",
            "visualblocks",
          ],
          toolbar:
            "undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 14px;
              line-height: 1.6;
            }
            h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
            h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
            h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
            h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
            h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
            h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
            p { margin: 1em 0; }
            ul, ol { margin: 1em 0; padding-left: 2em; }
            ul { list-style-type: disc; }
            ol { list-style-type: decimal; }
            li { margin: 0.5em 0; }
            blockquote { 
              margin: 1em 0; 
              padding-left: 1em; 
              border-left: 4px solid #e5e7eb;
              color: #6b7280;
            }
            a { color: #3b82f6; text-decoration: underline; }
            strong { font-weight: bold; }
            em { font-style: italic; }
            code { 
              background: #f3f4f6; 
              padding: 0.2em 0.4em; 
              border-radius: 0.25em;
              font-family: monospace;
            }
            pre { 
              background: #f3f4f6; 
              padding: 1em; 
              border-radius: 0.5em;
              overflow-x: auto;
            }
          `,
          placeholder: placeholder,
          skin: "oxide",
          content_css: "default",
          branding: false,
          promotion: false,
        }}
      />
    </div>
  );
};
