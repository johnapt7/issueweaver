
import { useState } from "react";
import { Button } from "@gravity-ui/uikit";
import { Card } from "@gravity-ui/uikit";
import { IssueCreator } from "@/components/IssueCreator";
import { AddReposDialog } from "@/components/AddReposDialog";
import { useToast } from "@/hooks/use-toast";
import { GitHubFill } from "@gravity-ui/icons";
import { Layout } from "@/components/Layout";
import "@gravity-ui/uikit/styles/styles.css";

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
          <Card type="container" className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Welcome to IssueWeaver
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add the repositories you want to manage
              </p>
              <Button
                onClick={handleGitHubTokenSubmit}
                view="action"
                size="l"
              >
                <GitHubFill />
                Add Repository
              </Button>
            </div>
          </Card>

          <IssueCreator />
        </div>
      </div>
      <AddReposDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Layout>
  );
}
