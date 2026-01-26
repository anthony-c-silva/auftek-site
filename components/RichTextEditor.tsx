"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import ExtensionBubbleMenu from '@tiptap/extension-bubble-menu'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useEffect, useState, useRef } from 'react'
import {
    Bold, Italic, List, ListOrdered,
    Heading1, Heading2, Quote, Image as ImageIcon,
    Undo, Redo, Loader2
} from 'lucide-react'

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                parseHTML: element => element.getAttribute('data-width') || element.style.width || '100%',
                renderHTML: attributes => {
                    return {
                        'data-width': attributes.width,
                        style: `width: ${attributes.width}`,
                        class: 'rounded-lg h-auto my-6 border border-slate-200 shadow-sm block mx-auto',
                    }
                }
            }
        }
    }
})

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            ExtensionBubbleMenu.configure({
                pluginKey: 'bubbleMenuForImage',
            }),
            CustomImage,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: `
                    prose prose-slate max-w-none 
                    focus:outline-none 
                    h-[600px] overflow-y-auto 
                    px-4 py-3 
                    leading-normal
                    [&_p]:my-0 [&_p]:min-h-[1.5em]
                    [&_li]:my-0 
                    [&_ul]:my-0 
                    [&_ol]:my-0
                    [&_h1]:mb-2 [&_h1]:mt-4
                    [&_h2]:mb-2 [&_h2]:mt-4
                    [&_h3]:mb-1 [&_h3]:mt-3
                `.replace(/\s+/g, ' ').trim(),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (editor.getText() === "" && value !== "<p></p>") {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'content');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error("Falha no upload");

            const data = await res.json();
            editor.chain().focus().setImage({ src: data.url }).run();

        } catch (error) {
            console.error(error);
            alert("Erro ao enviar imagem. Tente novamente.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    if (!editor) return null

    const ToolbarBtn = ({ onClick, isActive, icon: Icon, title, disabled }: any) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
                isActive ? 'bg-slate-200 text-blue-600' : 'text-slate-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Icon size={18} className={disabled ? 'animate-spin' : ''} />
        </button>
    )

    const ImageResizer = () => {
        const attrs = editor.getAttributes('image');
        const currentWidth = parseInt(attrs.width ? attrs.width.toString().replace('%', '') : '100');

        const [isEditing, setIsEditing] = useState(false);
        const [inputValue, setInputValue] = useState(currentWidth.toString());
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            setInputValue(currentWidth.toString());
        }, [currentWidth]);

        useEffect(() => {
            if (isEditing && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }, [isEditing]);

        const updateWidth = (newVal: number) => {
            editor.chain().focus().updateAttributes('image', { width: newVal + '%' }).run();
        };

        const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateWidth(parseInt(e.target.value));
        };

        const handleCommitInput = () => {
            let val = parseInt(inputValue);
            if (isNaN(val)) val = 100;
            if (val < 10) val = 10;
            if (val > 100) val = 100;

            updateWidth(val);
            setIsEditing(false);
            setInputValue(val.toString());
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleCommitInput();
            if (e.key === 'Escape') {
                setIsEditing(false);
                setInputValue(currentWidth.toString());
            }
        };

        return (
            <div className="flex items-center gap-3 px-3 py-2 min-w-[240px]">
                <div className="w-12 text-center">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleCommitInput}
                            onKeyDown={handleKeyDown}
                            className="w-full text-xs border border-blue-400 rounded px-1 py-0.5 outline-none text-center font-medium text-slate-700 bg-blue-50"
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className="text-xs text-slate-600 font-medium cursor-pointer hover:bg-slate-100 hover:text-blue-600 px-1 py-0.5 rounded transition-colors block"
                            title="Clique para digitar"
                        >
                            {currentWidth}%
                        </span>
                    )}
                </div>

                <input
                    type="range"
                    min="20"
                    max="100"
                    value={currentWidth}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                />
            </div>
        );
    };

    return (
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm hover:border-slate-400 transition-colors relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {editor && (
                <BubbleMenu
                    editor={editor}
                    shouldShow={({ editor }) => editor.isActive('image')}
                    className="bg-white shadow-xl border border-slate-200 rounded-lg flex overflow-hidden z-50"
                >
                    <ImageResizer />
                </BubbleMenu>
            )}

            <div className="bg-slate-50 border-b border-slate-200 p-1 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Negrito" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Itálico" />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading1} title="Título Principal" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading2} title="Subtítulo" />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Lista" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Lista Numerada" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Citação" />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <ToolbarBtn
                    onClick={triggerImageUpload}
                    isActive={false}
                    icon={isUploading ? Loader2 : ImageIcon}
                    title="Inserir Imagem"
                    disabled={isUploading}
                />
                <div className="flex-grow" />
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} icon={Undo} title="Desfazer" />
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} icon={Redo} title="Refazer" />
            </div>

            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor