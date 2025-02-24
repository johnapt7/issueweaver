
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface GitHubLoginButtonProps {
  onLogin: () => void;
}

export function GitHubLoginButton({ onLogin }: GitHubLoginButtonProps) {
  return (
    <Button
      onClick={onLogin}
      className="bg-[#24292F] hover:bg-[#24292F]/90 text-white"
    >
      <Github className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
}
