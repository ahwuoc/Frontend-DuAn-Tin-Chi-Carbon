// components/TiptapMenuBar.tsx
"use client"; // Nếu bạn dùng Next.js App Router

import React from 'react';
import { Editor } from '@tiptap/react'; // Import kiểu dữ liệu Editor
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
} from 'lucide-react'; // Sử dụng các icon từ lucide-react

interface TiptapMenuBarProps {
    editor: Editor | null;
}

const TiptapMenuBar: React.FC<TiptapMenuBarProps> = ({ editor }) => {
    if (!editor) {
        return null; // Không render menu nếu editor chưa sẵn sàng
    }

    // Hàm render một button menu
    const renderButton = (
        onClick: () => void,
        isActive: boolean,
        icon: React.ReactNode,
        tooltip: string
    ) => (
        <button
            type="button" // Quan trọng: set type="button" để tránh submit form
            onClick={onClick}
            className={`p-1 rounded transition-colors ${isActive ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
            title={tooltip}
        >
            {icon}
        </button>
    );

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1 sticky top-0 bg-white dark:bg-gray-900 z-10">
            {/* Bold */}
            {renderButton(
                () => editor.chain().focus().toggleBold().run(),
                editor.isActive('bold'),
                <Bold size={18} />,
                'In đậm (Ctrl+B)'
            )}

            {/* Italic */}
            {renderButton(
                () => editor.chain().focus().toggleItalic().run(),
                editor.isActive('italic'),
                <Italic size={18} />,
                'In nghiêng (Ctrl+I)'
            )}

            {/* Strikethrough */}
            {renderButton(
                () => editor.chain().focus().toggleStrike().run(),
                editor.isActive('strike'), // Tên extension trong StarterKit
                <Strikethrough size={18} />,
                'Gạch ngang (Ctrl+Shift+X)'
            )}

            <span className="mx-1 border-l border-gray-300 dark:border-gray-600"></span> {/* Divider */}

            {/* Heading 1 */}
            {renderButton(
                () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                editor.isActive('heading', { level: 1 }),
                <Heading1 size={18} />,
                'Tiêu đề 1'
            )}
            {/* Heading 2 */}
            {renderButton(
                () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                editor.isActive('heading', { level: 2 }),
                <Heading2 size={18} />,
                'Tiêu đề 2'
            )}
            {/* Heading 3 */}
            {renderButton(
                () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                editor.isActive('heading', { level: 3 }),
                <Heading3 size={18} />,
                'Tiêu đề 3'
            )}

            <span className="mx-1 border-l border-gray-300 dark:border-gray-600"></span> {/* Divider */}

            {/* Bullet List */}
            {renderButton(
                () => editor.chain().focus().toggleBulletList().run(),
                editor.isActive('bulletList'),
                <List size={18} />,
                'Danh sách không thứ tự'
            )}

            {/* Ordered List */}
            {renderButton(
                () => editor.chain().focus().toggleOrderedList().run(),
                editor.isActive('orderedList'),
                <ListOrdered size={18} />,
                'Danh sách có thứ tự'
            )}

            <span className="mx-1 border-l border-gray-300 dark:border-gray-600"></span> {/* Divider */}

            {/* Blockquote */}
            {renderButton(
                () => editor.chain().focus().toggleBlockquote().run(),
                editor.isActive('blockquote'),
                <Quote size={18} />,
                'Trích dẫn'
            )}

            <span className="mx-1 border-l border-gray-300 dark:border-gray-600"></span> {/* Divider */}

            {/* Undo */}
            {renderButton(
                () => editor.chain().focus().undo().run(),
                false, // Undo/Redo không có trạng thái 'active' theo cách thông thường
                <Undo size={18} />,
                'Hoàn tác (Ctrl+Z)'
            )}

            {/* Redo */}
            {renderButton(
                () => editor.chain().focus().redo().run(),
                false,
                <Redo size={18} />,
                'Làm lại (Ctrl+Y)'
            )}

            {/* Thêm các nút khác cho các extension bạn cài đặt */}
        </div>
    );
};

export default TiptapMenuBar;