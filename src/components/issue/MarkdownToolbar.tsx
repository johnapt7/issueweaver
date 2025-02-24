
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Link, Eye, EyeOff } from "lucide-react";

interface MarkdownToolbarProps {
  isPreview: boolean;
  onTogglePreview: (e: React.MouseEvent) => void;
  onFormatAction: (before: string, after?: string) => void;
}

export function MarkdownToolbar({ isPreview, onTogglePreview, onFormatAction }: MarkdownToolbarProps) {
  const formatActions = [
    {
      icon: Bold,
      label: "Bold",
      action: () => onFormatAction("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => onFormatAction("_", "_"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => onFormatAction("- "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => onFormatAction("1. "),
    },
    {
      icon: Link,
      label: "Link",
      action: () => onFormatAction("[", "](url)"),
    },
  ];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 border rounded-lg p-1">
        {formatActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.preventDefault();
              action.action();
            }}
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePreview}
        className="h-8"
      >
        {isPreview ? (
          <EyeOff className="h-4 w-4 mr-2" />
        ) : (
          <Eye className="h-4 w-4 mr-2" />
        )}
        {isPreview ? "Edit" : "Preview"}
      </Button>
    </div>
  );
}
