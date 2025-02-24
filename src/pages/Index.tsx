
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitHubLoginButton } from "@/components/GitHubLoginButton";
import { IssueCreator } from "@/components/IssueCreator";
import { IssueList } from "@/components/IssueList";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // In a real app, this would check the actual auth state
  useEffect(() => {
    // Simulated auth check
    const token = localStorage.getItem("github_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    // Simulate login for now
    localStorage.setItem("github_token", "dummy_token");
    setIsAuthenticated(true);
    toast({
      title: "Successfully logged in",
      description: "Welcome to IssueWeaver!",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("github_token");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              IssueWeaver
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Seamlessly manage GitHub issues across repositories
            </p>
          </div>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </header>

        {!isAuthenticated ? (
          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Welcome to IssueWeaver
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect with GitHub to start managing your issues
              </p>
              <GitHubLoginButton onLogin={handleLogin} />
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            <IssueCreator />
            <IssueList />
          </div>
        )}
      </div>
    </div>
  );
}
