
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { IssueSelector } from "@/components/planning-poker/IssueSelector";
import { VotingArea } from "@/components/planning-poker/VotingArea";
import { IssueDetail } from "@/components/issue/IssueDetail";
import { Button } from "@/components/ui/button";
import { Users, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("room");

  const handleIssueSelect = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const createRoom = () => {
    const newRoomId = crypto.randomUUID();
    navigate(`${location.pathname}?room=${newRoomId}`);
  };

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link with your team to join the session.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Planning Poker
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Collaborate with your team to estimate issues
              </p>
            </div>
            {!roomId ? (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={createRoom}
              >
                <Users className="h-4 w-4" />
                Create Room
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={copyRoomLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Share Room Link
              </Button>
            )}
          </div>
          {roomId && (
            <Card className="p-4 bg-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Room active - Share the link with your team to start voting together
                  </span>
                </div>
              </div>
            </Card>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card className="p-6">
            {selectedIssue ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {selectedIssue.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedIssue.repository}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetail(true)}
                  >
                    View Details
                  </Button>
                </div>
                <VotingArea issueId={selectedIssue.html_url} />
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center text-gray-500">
                {roomId ? "Select an issue to start planning poker" : "Create a room to start planning poker"}
              </div>
            )}
          </Card>

          <aside>
            <IssueSelector onIssueSelect={handleIssueSelect} />
          </aside>
        </div>

        {showDetail && selectedIssue && (
          <IssueDetail
            {...selectedIssue}
            onClose={() => setShowDetail(false)}
          />
        )}
      </div>
    </Layout>
  );
}
