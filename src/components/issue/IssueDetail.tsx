
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Edit, LinkIcon } from "lucide-react";
import { md } from "@/utils/markdown";

interface IssueDetailProps {
  title: string;
  body?: string;
  status: string;
  repository: string;
  created: string;
  html_url: string;
  onClose: () => void;
}

export function IssueDetail({
  title,
  body,
  status,
  repository,
  created,
  html_url,
  onClose,
}: IssueDetailProps) {
  return (
    <Card className="fixed inset-0 z-50 overflow-auto bg-white dark:bg-gray-800 p-6 m-4 md:m-8 rounded-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{repository}</span>
            <span>•</span>
            <span>{created}</span>
            <span>•</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === "open"
                  ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <a href={html_url} target="_blank" rel="noopener noreferrer">
              <LinkIcon className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {body ? (
          <div dangerouslySetInnerHTML={{ __html: md.render(body || '') }} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No description provided.</p>
        )}
      </div>
    </Card>
  );
}
