
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Repository {
  owner: string;
  repo: string;
}

export function IssueCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repository, setRepository] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem("repos") || "[]");
    setRepositories(repos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const [owner, repo] = repository.split("/");

      const { data: { secret }, error: secretError } = await supabase.functions.invoke("get-secret", {
        body: { name: "GITHUB_PAT" }
      });
      
      if (secretError) throw secretError;

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${secret}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body: description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create issue");
      }

      const issue = await response.json();

      toast({
        title: "Issue created",
        description: "Your issue has been successfully created!",
      });

      setTitle("");
      setDescription("");
      setRepository("");

      // Open the created issue in a new tab
      window.open(issue.html_url, "_blank");
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (repositories.length === 0) {
    return (
      <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Add a repository to start creating issues
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Create New Issue
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Repository
          </label>
          <Select value={repository} onValueChange={setRepository}>
            <SelectTrigger>
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map((repo) => (
                <SelectItem
                  key={`${repo.owner}/${repo.repo}`}
                  value={`${repo.owner}/${repo.repo}`}
                >
                  {repo.owner}/{repo.repo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your issue description in Markdown..."
            className="min-h-[200px] w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || !title || !description || !repository}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Issue...
              </>
            ) : (
              "Create Issue"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
