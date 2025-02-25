
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowUpDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Issue {
  title: string;
  created_at: string;
  html_url: string;
}

export function RecentIssuesTable() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data: { secret }, error: secretError } = await supabase.functions.invoke("get-secret", {
          body: { name: "GITHUB_PAT" }
        });
        
        if (secretError) throw secretError;

        const repos = JSON.parse(localStorage.getItem("repos") || "[]");
        const allIssues: Issue[] = [];

        for (const { owner, repo } of repos) {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/issues?creator=John-Thompson-3dj_nbcuni&state=all`,
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
              title: issue.title,
              created_at: new Date(issue.created_at).toLocaleString(),
              html_url: issue.html_url,
            }))
          );
        }

        // Initial sort
        allIssues.sort((a, b) => 
          sortDirection === 'desc' 
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        setIssues(allIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [sortDirection]);

  const handleSort = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Pagination calculations
  const totalPages = Math.ceil(issues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedIssues = issues.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-violet-600 dark:text-violet-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
        Your Recent Issues
      </h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Title</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={handleSort}
                  className="h-8 flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Created At
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedIssues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-600 dark:text-gray-400">
                  No issues found
                </TableCell>
              </TableRow>
            ) : (
              displayedIssues.map((issue, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a 
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      {issue.title}
                    </a>
                  </TableCell>
                  <TableCell>{issue.created_at}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={`cursor-pointer ${currentPage === 1 ? 'opacity-50' : 'hover:bg-violet-50 dark:hover:bg-violet-900/20'}`}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer ${
                      currentPage === page
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                        : "hover:bg-violet-50 dark:hover:bg-violet-900/20"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50' : 'hover:bg-violet-50 dark:hover:bg-violet-900/20'}`}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
