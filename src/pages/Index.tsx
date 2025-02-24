
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IssueCreator } from "@/components/IssueCreator";
import { IssueList } from "@/components/IssueList";
import { useToast } from "@/hooks/use-toast";
import { Github } from "lucide-react";

export default function Index() {
  const { toast } = useToast();

  const handleGitHubTokenSubmit = () => {
    toast({
      title: "Connecting to GitHub",
      description: "Please enter your GitHub Personal Access Token.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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

        <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Welcome to IssueWeaver
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connect with GitHub using your Personal Access Token
            </p>
            <Button
              onClick={handleGitHubTokenSubmit}
              className="bg-[#24292F] hover:bg-[#24292F]/90 text-white"
            >
              <Github className="mr-2 h-4 w-4" />
              Add GitHub Token
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
