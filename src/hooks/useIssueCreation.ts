
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Repository } from "@/types/github";

export function useIssueCreation() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const createIssue = async (owner: string, repo: string, title: string, description: string) => {
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

  const handleIssueCreation = async (
    title: string,
    description: string,
    selectedRepos: string[],
    onSuccess: () => void
  ) => {
    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        selectedRepos.map(async (repoPath) => {
          const [owner, repo] = repoPath.split("/");
          return createIssue(owner, repo, title, description);
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

        onSuccess();

        // Open successfully created issues in new tabs
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            window.open(result.value.html_url, "_blank");
          }
        });
      } else {
        throw new Error("Failed to create any issues");
      }
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

  return {
    submitting,
    handleIssueCreation,
  };
}
