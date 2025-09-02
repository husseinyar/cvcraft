
"use client";

import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, type ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button } from './ui/button';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string; // The initial value as a JSON string or plain text
  onChange: (value: string) => void; // Callback with the new value as a JSON string
}

const StyleButton = ({ onToggle, style, active, label, icon: Icon }: { onToggle: (style: string) => void, style: string, active: boolean, label: string, icon: React.ElementType }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(style);
  };
  return (
    <Button variant={active ? "secondary" : "ghost"} size="icon" onMouseDown={handleMouseDown} aria-label={label}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};

const BLOCK_TYPES = [
    { label: 'Unordered List', style: 'unordered-list-item', icon: List },
    { label: 'Ordered List', style: 'ordered-list-item', icon: ListOrdered },
];

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: Bold },
    { label: 'Italic', style: 'ITALIC', icon: Italic },
    { label: 'Underline', style: 'UNDERLINE', icon: Underline },
];

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    try {
      if (value) {
        const contentState = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } catch (e) {
      // Fallback for plain text
      setEditorState(EditorState.createWithContent(ContentState.createFromText(value || '')));
    }
  }, [value]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    onChange(JSON.stringify(rawContent));
  };

  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleBlockType = (blockType: string) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="border rounded-md p-2">
      <div className="flex items-center gap-1 mb-2 border-b pb-2">
        {INLINE_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={toggleInlineStyle}
            style={type.style}
            icon={type.icon}
          />
        )}
         {BLOCK_TYPES.map(type =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={toggleBlockType}
            style={type.style}
            icon={type.icon}
          />
        )}
      </div>
      <div className="prose dark:prose-invert min-h-[100px] text-sm" onClick={() => { /* focus logic here */ }}>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Enter your description..."
        />
      </div>
    </div>
  );
}
