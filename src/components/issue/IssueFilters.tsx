
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IssueFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRepo: string;
  setSelectedRepo: (repo: string) => void;
  repositories: string[];
  setCurrentPage: (page: number) => void;
}

export function IssueFilters({
  searchQuery,
  setSearchQuery,
  selectedRepo,
  setSelectedRepo,
  repositories,
  setCurrentPage,
}: IssueFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search issues by title, repository, or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-9 w-full"
        />
      </div>

      <Select
        value={selectedRepo}
        onValueChange={(value) => {
          setSelectedRepo(value);
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a repository" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Repositories</SelectItem>
          {repositories.map((repo) => (
            <SelectItem key={repo} value={repo}>
              {repo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
