
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DescriptionField } from "./DescriptionField";
import { RepositorySelector } from "./RepositorySelector";
import { Repository } from "@/types/github";

interface IssueFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  repositories: Repository[];
  selectedRepos: string[];
  setSelectedRepos: (repos: string[]) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function IssueForm({
  title,
  setTitle,
  description,
  setDescription,
  isPreview,
  setIsPreview,
  repositories,
  selectedRepos,
  setSelectedRepos,
  submitting,
  onSubmit,
}: IssueFormProps) {
  const handleRepositoryToggle = (repoPath: string, checked: boolean) => {
    setSelectedRepos(
      checked
        ? [...selectedRepos, repoPath]
        : selectedRepos.filter((r) => r !== repoPath)
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <RepositorySelector
        repositories={repositories}
        selectedRepos={selectedRepos}
        onRepositoryToggle={handleRepositoryToggle}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue title"
          className="w-full"
        />
      </div>

      <DescriptionField
        value={description}
        onChange={setDescription}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting || !title || !description || selectedRepos.length === 0}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Issues...
            </>
          ) : (
            `Create Issue${selectedRepos.length > 1 ? 's' : ''}`
          )}
        </Button>
      </div>
    </form>
  );
}
