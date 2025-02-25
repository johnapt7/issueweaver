
interface IssueCardProps {
  title: string;
  body?: string;
  status: string;
  repository: string;
  created: string;
  html_url: string;
  projectFields?: { [key: string]: string | number | null };
  onClick: () => void;
}

export function IssueCard({
  title,
  status,
  repository,
  created,
  projectFields,
  onClick
}: IssueCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
      {projectFields && Object.keys(projectFields).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(projectFields).map(([key, value]) => (
            value && (
              <span 
                key={key}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {key}: {value}
              </span>
            )
          ))}
        </div>
      )}
    </button>
  );
}
