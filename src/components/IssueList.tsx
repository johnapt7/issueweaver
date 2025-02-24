
import { Card } from "@/components/ui/card";

export function IssueList() {
  // Simulated issues data
  const issues = [
    {
      id: 1,
      title: "Example Issue 1",
      repository: "repo1",
      status: "open",
      created: "2024-02-20",
    },
    {
      id: 2,
      title: "Example Issue 2",
      repository: "repo2",
      status: "closed",
      created: "2024-02-19",
    },
  ];

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Recent Issues
      </h2>
      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {issue.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  issue.status === "open"
                    ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
                }`}
              >
                {issue.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{issue.repository}</span>
              <span className="mx-2">•</span>
              <span>{issue.created}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
