
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GitHubLoginButtonProps {
  onLogin: () => void;
}

export function GitHubLoginButton({ onLogin }: GitHubLoginButtonProps) {
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'repo'  // Request access to repositories
        }
      });
      
      if (error) throw error;
      onLogin();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="bg-[#24292F] hover:bg-[#24292F]/90 text-white"
    >
      <Github className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
}
