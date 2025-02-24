
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus } from "lucide-react";
import { ThemeProvider } from "@gravity-ui/uikit";

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
  ];

  return (
    <ThemeProvider theme="light">
      <div className="min-h-screen bg-[var(--g-color-base-background)]">
        <nav className="sticky top-0 z-10 backdrop-blur-sm bg-[var(--g-color-base-background-elevated)] border-b border-[var(--g-color-line-generic)]">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-16">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? "text-[var(--g-color-text-primary)]"
                        : "text-[var(--g-color-text-secondary)] hover:text-[var(--g-color-text-primary)]"
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
    </ThemeProvider>
  );
}
