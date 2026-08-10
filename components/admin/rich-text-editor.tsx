"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useRef, useState } from "react";
import { Bold, Image as ImageIcon, Italic, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/app/admin/actions/media";

export function RichTextEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[220px] rounded-b-lg border border-t-0 p-4 focus:outline-none",
      },
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const formData = new FormData();
    formData.set("file", file);
    try {
      const { url } = await uploadImage(formData, "noticias");
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div>
      {/* Campo oculto que sincroniza el HTML del editor con el <form> nativo */}
      <input type="hidden" name={name} value={html} readOnly />

      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border bg-secondary/40 p-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={editor?.isActive("bold") ? "bg-secondary" : ""}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={editor?.isActive("italic") ? "bg-secondary" : ""}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={editor?.isActive("bulletList") ? "bg-secondary" : ""}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={editor?.isActive("orderedList") ? "bg-secondary" : ""}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = window.prompt("URL del enlace:");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon className="size-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
