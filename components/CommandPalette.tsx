// components/CommandPalette.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  X, 
  Dashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  ExternalLink,
  Command
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const commands: Command[] = [
    {
      id: "dashboard",
      title: "Go to Dashboard",
      description: "View your main dashboard",
      icon: Dashboard,
      action: () => router.push("/dashboard"),
      category: "Navigation"
    },
    {
      id: "requests",
      title: "DSAR Requests",
      description: "Manage data subject requests",
      icon: FileText,
      action: () => router.push("/requests"),
      category: "Navigation"
    },
    {
      id: "reports",
      title: "Compliance Reports",
      description: "View and generate reports",
      icon: BarChart3,
      action: () => router.push("/compliance-reports"),
      category: "Navigation"
    },
    {
      id: "admin",
      title: "Admin Panel",
      description: "System administration",
      icon: Settings,
      action: () => router.push("/admin"),
      category: "Admin"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage users and roles",
      icon: Users,
      action: () => router.push("/admin/users"),
      category: "Admin"
    },
    {
      id: "docs",
      title: "Documentation",
      description: "View help and guides",
      icon: ExternalLink,
      action: () => router.push("/docs"),
      category: "Help"
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandSelect = (command: Command) => {
    command.action();
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide bg-slate-50">
                  {category}
                </div>
                {categoryCommands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleCommandSelect(command)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="font-medium">{command.title}</div>
                        <div className="text-sm text-slate-500">{command.description}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <Command className="h-3 w-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
            
            {filteredCommands.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p>No commands found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 text-xs text-slate-400 border-t bg-slate-50">
            <div className="flex items-center justify-between">
              <span>Press ⌘K to open command palette</span>
              <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
