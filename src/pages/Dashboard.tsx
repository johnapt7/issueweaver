
import { IssueList } from "@/components/IssueList";
import { Layout } from "@/components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Issue Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of all issues across your repositories
          </p>
        </header>
        <IssueList />
      </div>
    </Layout>
  );
}
