
import { useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface IssueSelectorProps {
  onIssueSelect: (issue: any) => void;
}

export function IssueSelector({ onIssueSelect }: IssueSelectorProps) {
  const { issues, loading } = useIssues();
  const [search, setSearch] = useState("");

  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No issues found</p>
        ) : (
          filteredIssues.map((issue) => (
            <button
              key={issue.html_url}
              onClick={() => onIssueSelect(issue)}
              className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {issue.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{issue.repository}</p>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
