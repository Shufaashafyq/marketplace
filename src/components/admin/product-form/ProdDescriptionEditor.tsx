import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Pilcrow,
} from "lucide-react";

type ProductDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled: boolean;
  error: boolean;
};

function ProductDescriptionEditor({
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: ProductDescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur,
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] px-3 py-3 text-sm text-[#8F8585] outline-none [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#560319] [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[#560319] [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:pl-1",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }

    editor.setEditable(!disabled);
  }, [editor, value, disabled]);

  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `rounded-md p-2 transition-colors ${
      active
        ? "bg-[#F3EAF5] text-[#560319]"
        : "text-[#8F8585] hover:bg-[#F3EAF5] hover:text-[#560319]"
    }`;

  return (
    <div
      className={`overflow-hidden rounded-lg border bg-white transition-all ${
        error
          ? "border-[#C84B5E]"
          : "border-[#E8DCEB] focus-within:border-[#93c572] focus-within:ring-2 focus-within:ring-[#93c572]/30"
      } ${disabled ? "opacity-60" : ""}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E8DCEB] bg-[#FDFCFD] p-2">
        <button
          type="button"
          disabled={disabled}
          title="Paragraph"
          onClick={() =>
            editor.chain().focus().setParagraph().run()
          }
          className={buttonClass(
            editor.isActive("paragraph")
          )}
        >
          <Pilcrow size={16} />
        </button>

        <button
          type="button"
          disabled={disabled}
          title="Heading"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", { level: 2 })
          )}
        >
          <Heading2 size={16} />
        </button>

        <div className="mx-1 h-5 w-px bg-[#E8DCEB]" />

        <button
          type="button"
          disabled={disabled}
          title="Bold"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={buttonClass(editor.isActive("bold"))}
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          disabled={disabled}
          title="Italic"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={buttonClass(editor.isActive("italic"))}
        >
          <Italic size={16} />
        </button>

        <div className="mx-1 h-5 w-px bg-[#E8DCEB]" />

        <button
          type="button"
          disabled={disabled}
          title="Bullet list"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={buttonClass(
            editor.isActive("bulletList")
          )}
        >
          <List size={16} />
        </button>

        <button
          type="button"
          disabled={disabled}
          title="Numbered list"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={buttonClass(
            editor.isActive("orderedList")
          )}
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

export default ProductDescriptionEditor;
