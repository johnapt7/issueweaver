
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IssueCard } from "./issue/IssueCard";
import { IssueFilters } from "./issue/IssueFilters";
import { IssueDetail } from "./issue/IssueDetail";
import { useIssues } from "@/hooks/useIssues";

const ISSUES_PER_PAGE = 5;

export function IssueList() {
  const { issues, loading } = useIssues();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const repositories = [...new Set(issues.map((issue) => issue.repository))];

  const filteredIssues = issues.filter((issue) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchLower) ||
      issue.repository.toLowerCase().includes(searchLower) ||
      issue.status.toLowerCase().includes(searchLower);
    
    const matchesRepo = selectedRepo === "all" || issue.repository === selectedRepo;
    
    return matchesSearch && matchesRepo;
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
    <>
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Recent Issues
        </h2>

        <IssueFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
          repositories={repositories}
          setCurrentPage={setCurrentPage}
        />

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
                <IssueCard
                  key={issue.id}
                  {...issue}
                  onClick={() => setSelectedIssue(issue)}
                />
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
      
      {selectedIssue && (
        <IssueDetail
          {...selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </>
  );
}
