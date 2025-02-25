
import { useEffect, useState } from "react";
import { IssueList } from "@/components/IssueList";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Repository } from "@/types/github";
import { Github } from "lucide-react";

export default function Dashboard() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem("repos") || "[]");
    setRepositories(repos);
  }, []);

  const handleRepoClick = (repo: Repository) => {
    // Store the selected repo in localStorage for filtering
    localStorage.setItem("selectedRepo", JSON.stringify(repo));
    window.location.href = "/dashboard"; // Refresh to show filtered issues
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Issue Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of all issues across your repositories
          </p>
        </header>

        {repositories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Your Repositories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {repositories.map((repo, index) => (
                <button
                  key={index}
                  onClick={() => handleRepoClick(repo)}
                  className="group relative w-full"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                  <Card className="relative h-full p-6 flex items-center gap-3 bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 group-hover:border-violet-500/50 transition duration-200">
                    <Github className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {repo.owner}/{repo.repo}
                    </span>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}

        <IssueList />
      </div>
    </Layout>
  );
}
