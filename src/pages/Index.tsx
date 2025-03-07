
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IssueCreator } from "@/components/IssueCreator";
import { AddReposDialog } from "@/components/AddReposDialog";
import { useToast } from "@/hooks/use-toast";
import { Github } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecentIssuesTable } from "@/components/RecentIssuesTable";

export default function Index() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleGitHubTokenSubmit = () => {
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              IssueWeaver
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Seamlessly manage GitHub issues across repositories
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Welcome to IssueWeaver
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add the repositories you want to manage
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGitHubTokenSubmit}
                  className="bg-[#24292F] hover:bg-[#24292F]/90 text-white"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Add Repository
                </Button>
                <IssueCreator />
              </div>
            </div>
          </Card>

          <RecentIssuesTable />
        </div>
      </div>
      <AddReposDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Layout>
  );
}
