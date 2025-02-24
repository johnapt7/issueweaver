
import { Checkbox } from "@/components/ui/checkbox";
import { Repository } from "@/types/github";

interface RepositorySelectorProps {
  repositories: Repository[];
  selectedRepos: string[];
  onRepositoryToggle: (repoPath: string, checked: boolean) => void;
}

export function RepositorySelector({
  repositories,
  selectedRepos,
  onRepositoryToggle,
}: RepositorySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Repositories
      </label>
      <div className="space-y-2">
        {repositories.map((repo) => {
          const repoPath = `${repo.owner}/${repo.repo}`;
          return (
            <div key={repoPath} className="flex items-center space-x-2">
              <Checkbox
                id={repoPath}
                checked={selectedRepos.includes(repoPath)}
                onCheckedChange={(checked) => {
                  onRepositoryToggle(repoPath, checked as boolean);
                }}
              />
              <label
                htmlFor={repoPath}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {repoPath}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
