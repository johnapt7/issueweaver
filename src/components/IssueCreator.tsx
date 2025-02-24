
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, PlusCircle } from "lucide-react";
import { DescriptionField } from "./issue/DescriptionField";
import { Repository } from "@/types/github";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function IssueCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem("repos") || "[]");
    setRepositories(repos);
  }, []);

  const createIssue = async (owner: string, repo: string) => {
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
      throw new Error(`Failed to create issue in ${owner}/${repo}`);
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        selectedRepos.map(async (repoPath) => {
          const [owner, repo] = repoPath.split("/");
          return createIssue(owner, repo);
        })
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failureCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successCount > 0) {
        toast({
          title: "Issues created",
          description: `Successfully created issues in ${successCount} repositories${
            failureCount > 0 ? ` (${failureCount} failed)` : ""
          }`,
        });

        setTitle("");
        setDescription("");
        setSelectedRepos([]);
        setOpen(false);
      } else {
        throw new Error("Failed to create any issues");
      }

      // Open successfully created issues in new tabs
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          window.open(result.value.html_url, "_blank");
        }
      });
    } catch (error) {
      console.error("Error creating issues:", error);
      toast({
        title: "Error",
        description: "Failed to create issues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mainContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                    setSelectedRepos(
                      checked
                        ? [...selectedRepos, repoPath]
                        : selectedRepos.filter((r) => r !== repoPath)
                    );
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Issue
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full md:w-[800px] sm:max-w-full">
        <SheetHeader className="mb-8">
          <SheetTitle>Create New Issue</SheetTitle>
        </SheetHeader>
        {mainContent}
      </SheetContent>
    </Sheet>
  );
}
