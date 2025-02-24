
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  repository: string;
  status: string;
  created: string;
  html_url: string;
}

export function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data: { secret }, error: secretError } = await supabase.functions.invoke("get-secret", {
          body: { name: "GITHUB_PAT" }
        });
        
        if (secretError) throw secretError;

        // Get repositories from localStorage
        const repos = JSON.parse(localStorage.getItem("repos") || "[]");
        const allIssues: Issue[] = [];

        // Fetch issues for each repository
        for (const { owner, repo } of repos) {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
            {
              headers: {
                Authorization: `token ${secret}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!response.ok) throw new Error(`Error fetching issues for ${owner}/${repo}`);

          const repoIssues = await response.json();
          allIssues.push(
            ...repoIssues.map((issue: any) => ({
              id: issue.id,
              title: issue.title,
              repository: `${owner}/${repo}`,
              status: issue.state,
              created: new Date(issue.created_at).toLocaleDateString(),
              html_url: issue.html_url,
            }))
          );
        }

        setIssues(allIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Recent Issues
      </h2>
      <div className="space-y-4">
        {issues.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No issues found. Add a repository to get started.
          </p>
        ) : (
          issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
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
            </a>
          ))
        )}
      </div>
    </Card>
  );
}
