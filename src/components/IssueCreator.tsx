
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function IssueCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repository, setRepository] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would submit to GitHub API
    console.log({ title, description, repository });
    toast({
      title: "Issue created",
      description: "Your issue has been successfully created!",
    });
    setTitle("");
    setDescription("");
    setRepository("");
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Create New Issue
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Repository
          </label>
          <Select value={repository} onValueChange={setRepository}>
            <SelectTrigger>
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repo1">Repository 1</SelectItem>
              <SelectItem value="repo2">Repository 2</SelectItem>
              <SelectItem value="repo3">Repository 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue title"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your issue description in Markdown..."
            className="min-h-[200px] w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={!title || !description || !repository}>
            Create Issue
          </Button>
        </div>
      </form>
    </Card>
  );
}
