
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
  projectFields?: { [key: string]: string | number | null };
  onClose: () => void;
}

export function IssueDetail({
  title,
  body,
  status,
  repository,
  created,
  html_url,
  projectFields,
  onClose,
}: IssueDetailProps) {
  return (
    <Card className="fixed inset-0 z-50 overflow-auto bg-white dark:bg-gray-800 p-6 m-4 md:m-8 rounded-lg">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
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

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-700 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-strong:font-semibold prose-table:border-collapse prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-2 prose-td:p-2">
            {body ? (
              <div dangerouslySetInnerHTML={{ __html: md.render(body || '') }} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No description provided.</p>
            )}
          </div>
        </div>

        {/* Project fields sidebar */}
        {projectFields && Object.keys(projectFields).length > 0 && (
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Project Fields
              </h2>
              <div className="space-y-3">
                {Object.entries(projectFields).map(([key, value]) => (
                  value && (
                    <div 
                      key={key}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {key}
                      </div>
                      <div className="mt-1 text-gray-900 dark:text-gray-100">
                        {value}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
