import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useRef, useState } from "react";
import { uploadBlogImage } from "@/lib/blog";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

type AltModalState =
  | { mode: "upload"; file: File; initialAlt: string }
  | { mode: "edit"; initialAlt: string }
  | null;

export function RichEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [altModal, setAltModal] = useState<AltModalState>(null);
  const [altValue, setAltValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [, forceTick] = useState(0);

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
    onSelectionUpdate: () => forceTick((n) => n + 1),
    onTransaction: () => forceTick((n) => n + 1),
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

  const openUploadModal = (file: File) => {
    setUploadError(null);
    setAltValue("");
    setAltModal({ mode: "upload", file, initialAlt: "" });
  };

  const openEditAltModal = () => {
    if (!editor.isActive("image")) return;
    const attrs = editor.getAttributes("image");
    const currentAlt = (attrs.alt as string) || "";
    setUploadError(null);
    setAltValue(currentAlt);
    setAltModal({ mode: "edit", initialAlt: currentAlt });
  };

  const closeModal = () => {
    if (uploading) return;
    setAltModal(null);
    setAltValue("");
    setUploadError(null);
  };

  const confirmAlt = async () => {
    const alt = altValue.trim();
    if (!alt) {
      setUploadError("Texto alternativo é obrigatório.");
      return;
    }
    if (!altModal) return;

    if (altModal.mode === "edit") {
      editor.chain().focus().updateAttributes("image", { alt }).run();
      setAltModal(null);
      setAltValue("");
      return;
    }

    // upload
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadBlogImage(altModal.file);
      editor.chain().focus().setImage({ src: url, alt }).run();
      setAltModal(null);
      setAltValue("");
    } catch (e: any) {
      setUploadError(`Erro no upload: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const imageActive = editor.isActive("image");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 4, background: "#fff", position: "relative" }}>
      <Toolbar
        editor={editor}
        onInsertImage={() => fileRef.current?.click()}
        onEditAlt={openEditAltModal}
        imageActive={imageActive}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) openUploadModal(f);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} />

      {altModal && (
        <AltModal
          mode={altModal.mode}
          value={altValue}
          onChange={setAltValue}
          onConfirm={confirmAlt}
          onCancel={closeModal}
          uploading={uploading}
          error={uploadError}
        />
      )}
    </div>
  );
}

function AltModal({
  mode,
  value,
  onChange,
  onConfirm,
  onCancel,
  uploading,
  error,
}: {
  mode: "upload" | "edit";
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  uploading: boolean;
  error: string | null;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        borderRadius: 4,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 6,
          width: "min(440px, 92%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#7C1638" }}>
          {mode === "upload" ? "Inserir imagem" : "Editar texto alternativo"}
        </div>
        <div style={{ fontSize: 13, color: "#595959", marginBottom: 12 }}>
          Texto alternativo (alt) — obrigatório. Descreva a imagem para acessibilidade e SEO.
        </div>
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onConfirm();
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel();
            }
          }}
          placeholder="Ex.: Gráfico mostrando crescimento de receita"
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: 14,
            outline: "none",
          }}
        />
        {error && (
          <div style={{ color: "#b00020", fontSize: 13, marginTop: 8 }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            style={{
              padding: "8px 14px",
              background: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: 4,
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={uploading}
            style={{
              padding: "8px 14px",
              background: "#7C1638",
              color: "#fff",
              border: "1px solid #7C1638",
              borderRadius: 4,
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {uploading ? "Enviando…" : mode === "upload" ? "Inserir" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toolbar({
  editor,
  onInsertImage,
  onEditAlt,
  imageActive,
}: {
  editor: Editor;
  onInsertImage: () => void;
  onEditAlt: () => void;
  imageActive: boolean;
}) {
  const Btn = ({
    onClick,
    active,
    children,
    title,
    disabled,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 10px",
        background: active ? "#7C1638" : "#fff",
        color: active ? "#fff" : "#333",
        border: "1px solid #ddd",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
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
      <Btn
        title="Editar alt da imagem selecionada"
        onClick={onEditAlt}
        disabled={!imageActive}
      >
        Alt
      </Btn>
    </div>
  );
}
