
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitHubLoginButton } from "@/components/GitHubLoginButton";
import { IssueCreator } from "@/components/IssueCreator";
import { IssueList } from "@/components/IssueList";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { session, loading, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Redirecting to GitHub",
      description: "Please complete the authentication process.",
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

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
          {session && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={session.user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user.user_metadata.user_name}
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </header>

        {!session ? (
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
