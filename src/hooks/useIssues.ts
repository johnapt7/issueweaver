
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Issue {
  id: number;
  title: string;
  body?: string;
  repository: string;
  status: string;
  created: string;
  html_url: string;
}

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

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
              body: issue.body,
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

  return { issues, loading };
}
