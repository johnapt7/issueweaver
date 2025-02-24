
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Loader2, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Issue {
  id: number;
  title: string;
  repository: string;
  status: string;
  created: string;
  html_url: string;
}

const ISSUES_PER_PAGE = 5;

export function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredIssues = issues.filter((issue) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(searchLower) ||
      issue.repository.toLowerCase().includes(searchLower) ||
      issue.status.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredIssues.length / ISSUES_PER_PAGE);
  const startIndex = (currentPage - 1) * ISSUES_PER_PAGE;
  const displayedIssues = filteredIssues.slice(startIndex, startIndex + ISSUES_PER_PAGE);

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

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search issues by title, repository, or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            {issues.length === 0
              ? "No issues found. Add a repository to get started."
              : "No issues match your search."}
          </p>
        ) : (
          <>
            {displayedIssues.map((issue) => (
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
            ))}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="cursor-pointer"
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="cursor-pointer"
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
