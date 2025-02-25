
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
      className="w-full text-left p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "open"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
              : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
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
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 border border-violet-200/50 dark:border-violet-700/50"
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
