import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";
import { uploadBlogImage } from "@/lib/blog";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-content",
        style:
          "min-height: 360px; padding: 16px; outline: none; font-size: 16px; line-height: 1.7; color: #2b2b2b;",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync when switching articles
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "<p></p>") !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        style={{
          minHeight: 360,
          border: "1px solid #ddd",
          borderRadius: 4,
          background: "#fafafa",
        }}
      />
    );
  }

  const onPickImage = async (file: File) => {
    const alt = window.prompt("Texto alternativo (alt) para a imagem — obrigatório:");
    if (!alt || !alt.trim()) {
      alert("Texto alternativo é obrigatório.");
      return;
    }
    try {
      const url = await uploadBlogImage(file);
      editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run();
    } catch (e: any) {
      alert(`Erro no upload: ${e.message}`);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 4, background: "#fff" }}>
      <Toolbar editor={editor} onInsertImage={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickImage(f);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({
  editor,
  onInsertImage,
}: {
  editor: Editor;
  onInsertImage: () => void;
}) {
  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        padding: "6px 10px",
        background: active ? "#7C1638" : "#fff",
        color: active ? "#fff" : "#333",
        border: "1px solid #ddd",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        padding: 10,
        borderBottom: "1px solid #eee",
        background: "#fafafa",
      }}
    >
      <Btn
        title="Título H2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Btn>
      <Btn
        title="Subtítulo H3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Btn>
      <Btn
        title="Negrito"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <b>B</b>
      </Btn>
      <Btn
        title="Itálico"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i>I</i>
      </Btn>
      <Btn
        title="Lista"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • Lista
      </Btn>
      <Btn
        title="Parágrafo"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        ¶
      </Btn>
      <Btn title="Inserir imagem" onClick={onInsertImage}>
        🖼 Imagem
      </Btn>
    </div>
  );
}
