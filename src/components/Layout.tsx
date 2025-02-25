
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, Edit } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    {
      href: "/",
      label: "Create Issue",
      icon: Plus,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/markdown-editor",
      label: "Markdown Editor",
      icon: Edit,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="sticky top-0 z-10 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
