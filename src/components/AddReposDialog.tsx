
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AddReposDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReposDialog({ open, onOpenChange }: AddReposDialogProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddRepo = async () => {
    try {
      setLoading(true);
      
      // Get the GitHub PAT from Supabase
      const { data: { secret }, error: secretError } = await supabase.functions.invoke("get-secret", {
        body: { name: "GITHUB_PAT" }
      });
      
      if (secretError) throw secretError;

      // Extract owner and repo from URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid GitHub repository URL",
          variant: "destructive",
        });
        return;
      }

      const [, owner, repo] = match;

      // Validate repository access
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${secret}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not access repository");
      }

      // Store repository in local storage
      const storedRepos = JSON.parse(localStorage.getItem("repos") || "[]");
      const newRepo = { owner, repo };
      
      if (!storedRepos.some((r: any) => r.owner === owner && r.repo === repo)) {
        localStorage.setItem("repos", JSON.stringify([...storedRepos, newRepo]));
      }

      toast({
        title: "Repository added",
        description: `Successfully added ${owner}/${repo}`,
      });

      setRepoUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding repository:", error);
      toast({
        title: "Error",
        description: "Failed to add repository. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Repository</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter the full URL of the GitHub repository you want to manage
            </p>
          </div>
          <Button 
            onClick={handleAddRepo} 
            className="w-full"
            disabled={loading || !repoUrl}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Repository...
              </>
            ) : (
              "Add Repository"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
