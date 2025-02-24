
import { Textarea } from "@/components/ui/textarea";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { md, insertText } from "@/utils/markdown";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isPreview: boolean;
  setIsPreview: (value: boolean) => void;
}

export function DescriptionField({ value, onChange, isPreview, setIsPreview }: DescriptionFieldProps) {
  const handleFormatAction = (before: string, after?: string) => {
    const textarea = document.querySelector("textarea");
    const newText = insertText(value, textarea, before, after);
    onChange(newText);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Description
        </label>
        <MarkdownToolbar
          isPreview={isPreview}
          onTogglePreview={(e) => {
            e.preventDefault();
            setIsPreview(!isPreview);
          }}
          onFormatAction={handleFormatAction}
        />
      </div>
      {isPreview ? (
        <div 
          className="min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: md.render(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your issue description in Markdown..."
          className="min-h-[500px] w-full font-mono"
        />
      )}
    </div>
  );
}
