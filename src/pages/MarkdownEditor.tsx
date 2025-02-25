
import { useState } from "react";
import { Editor } from "@gravity-ui/markdown-editor";
import "@gravity-ui/markdown-editor/styles/bundle.css";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";

export default function MarkdownEditor() {
  const [content, setContent] = useState("");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Markdown Editor
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and edit markdown content with a rich text editor
          </p>
        </header>

        <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
          <Editor
            value={content}
            onChange={setContent}
            placeholder="Start writing in markdown..."
            className="min-h-[500px]"
          />
        </Card>
      </div>
    </Layout>
  );
}
