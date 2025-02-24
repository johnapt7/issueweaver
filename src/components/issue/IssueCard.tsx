
interface IssueCardProps {
  title: string;
  status: string;
  repository: string;
  created: string;
  html_url: string;
}

export function IssueCard({ title, status, repository, created, html_url }: IssueCardProps) {
  return (
    <a
      href={html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
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
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{repository}</span>
        <span className="mx-2">•</span>
        <span>{created}</span>
      </div>
    </a>
  );
}
