
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
  projectFields?: { [key: string]: string | number | null };
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

        // First, get the project ID
        const projectQuery = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `bearer ${secret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                organization(login: "NBCUDTC") {
                  projectV2(number: 103) {
                    id
                    fields(first: 20) {
                      nodes {
                        ... on ProjectV2Field {
                          name
                          id
                        }
                        ... on ProjectV2SingleSelectField {
                          name
                          id
                          options {
                            name
                            id
                          }
                        }
                        ... on ProjectV2IterationField {
                          name
                          id
                        }
                        ... on ProjectV2DateField {
                          name
                          id
                        }
                      }
                    }
                    items(first: 100) {
                      nodes {
                        content {
                          ... on Issue {
                            id
                            number
                            title
                          }
                        }
                        fieldValues(first: 20) {
                          nodes {
                            ... on ProjectV2ItemFieldTextValue {
                              text
                              field { name }
                            }
                            ... on ProjectV2ItemFieldNumberValue {
                              number
                              field { name }
                            }
                            ... on ProjectV2ItemFieldSingleSelectValue {
                              name
                              field { name }
                            }
                            ... on ProjectV2ItemFieldIterationValue {
                              title
                              field { name }
                            }
                            ... on ProjectV2ItemFieldDateValue {
                              date
                              field { name }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          }),
        });

        const projectData = await projectQuery.json();
        console.log('Project Data:', projectData);
        
        const projectFields = new Map();
        
        // Create a map of issue numbers to their project field values
        projectData.data?.organization?.projectV2?.items?.nodes?.forEach((item: any) => {
          const issueNumber = item.content?.number;
          if (issueNumber) {
            const fields: { [key: string]: string | number | null } = {};
            item.fieldValues.nodes.forEach((fieldValue: any) => {
              if (fieldValue.field?.name) {
                fields[fieldValue.field.name] = 
                  fieldValue.text || 
                  fieldValue.number || 
                  fieldValue.name || 
                  (fieldValue.date ? new Date(fieldValue.date).toLocaleDateString() : null) ||
                  fieldValue.title || 
                  null;
              }
            });
            console.log(`Fields for issue #${issueNumber}:`, fields);
            projectFields.set(issueNumber, fields);
          }
        });

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
            ...repoIssues.map((issue: any) => {
              const issueFields = projectFields.get(issue.number) || {};
              console.log(`Project fields for issue #${issue.number}:`, issueFields);
              return {
                id: issue.id,
                title: issue.title,
                body: issue.body,
                repository: `${owner}/${repo}`,
                status: issue.state,
                created: new Date(issue.created_at).toLocaleDateString(),
                html_url: issue.html_url,
                projectFields: issueFields,
              };
            })
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
