
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Repository } from "@/types/github";
import { IssueForm } from "./issue/IssueForm";
import { useIssueCreation } from "@/hooks/useIssueCreation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function IssueCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [open, setOpen] = useState(false);
  const { submitting, handleIssueCreation } = useIssueCreation();

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem("repos") || "[]");
    setRepositories(repos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleIssueCreation(title, description, selectedRepos, () => {
      setTitle("");
      setDescription("");
      setSelectedRepos([]);
      setOpen(false);
    });
  };

  if (repositories.length === 0) {
    return (
      <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Add a repository to start creating issues
        </div>
      </Card>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Issue
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-full md:w-[800px] sm:max-w-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Create New Issue
          </SheetTitle>
        </SheetHeader>
        <IssueForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          repositories={repositories}
          selectedRepos={selectedRepos}
          setSelectedRepos={setSelectedRepos}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </SheetContent>
    </Sheet>
  );
}
