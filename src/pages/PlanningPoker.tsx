
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { IssueSelector } from "@/components/planning-poker/IssueSelector";
import { VotingArea } from "@/components/planning-poker/VotingArea";
import { IssueDetail } from "@/components/issue/IssueDetail";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Issue {
  title: string;
  body?: string;
  status: string;
  repository: string;
  created: string;
  html_url: string;
  projectFields?: { [key: string]: string | number | null };
}

export default function PlanningPoker() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleIssueSelect = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Planning Poker
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Collaborate with your team to estimate issues
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              const roomId = crypto.randomUUID();
              navigate(`${location.pathname}?room=${roomId}`);
            }}
          >
            <Users className="h-4 w-4" />
            Create Room
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card className="p-6">
            {selectedIssue ? (
              <div className="space-y-6">
                <IssueDetail
                  title={selectedIssue.title}
                  body={selectedIssue.body}
                  status={selectedIssue.status}
                  repository={selectedIssue.repository}
                  created={selectedIssue.created}
                  html_url={selectedIssue.html_url}
                  projectFields={selectedIssue.projectFields}
                  onClose={() => setSelectedIssue(null)}
                />
                <VotingArea issueId={selectedIssue.html_url} />
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center text-gray-500">
                Select an issue to start planning poker
              </div>
            )}
          </Card>

          <aside>
            <IssueSelector onIssueSelect={handleIssueSelect} />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
