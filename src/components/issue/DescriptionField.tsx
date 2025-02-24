
import { useState } from "react";
import { MarkdownEditor } from "@gravity-ui/markdown-editor";
import "@gravity-ui/markdown-editor/styles/styles.css";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
}

export function DescriptionField({ value, onChange }: DescriptionFieldProps) {
  const [editorValue, setEditorValue] = useState(value);

  const handleChange = (newValue: string) => {
    setEditorValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Description
      </label>
      <MarkdownEditor
        value={editorValue}
        onChange={handleChange}
        placeholder="Write your issue description in Markdown..."
        minHeight={200}
        className="w-full"
      />
    </div>
  );
}
