import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  HelpCircle, 
  Search, 
  Play, 
  BookOpen, 
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface HelpContent {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  category: string;
}

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContent, setSelectedContent] = useState<HelpContent | null>(null);

  const helpContent: HelpContent[] = [
    {
      id: "1",
      title: "How to Process a DSAR Request",
      content: "DSAR requests are automatically processed when received. You can track the status in the dashboard and download the export when ready.",
      videoUrl: "https://example.com/dsar-processing",
      category: "dsar"
    },
    {
      id: "2",
      title: "Understanding AI Copilot",
      content: "AI Copilot analyzes your DSAR requests and provides intelligent insights, priority scoring, and response suggestions.",
      videoUrl: "https://example.com/ai-copilot",
      category: "ai"
    },
    {
      id: "3",
      title: "Credit System Explained",
      content: "Each DSAR request costs 10 credits. Free plan includes 100 credits (10 DSAR requests). Upgrade to Pro for unlimited requests.",
      category: "billing"
    },
    {
      id: "4",
      title: "Export Formats",
      content: "Exports are available in PDF, JSON, and CSV formats. Each includes comprehensive audit logs and data summaries.",
      category: "export"
    },
    {
      id: "5",
      title: "GDPR Compliance",
      content: "Our platform ensures full GDPR compliance with 30-day response times, secure data handling, and comprehensive audit trails.",
      category: "compliance"
    },
    {
      id: "6",
      title: "Team Collaboration",
      content: "Invite team members with different roles: Admin (full access), Editor (process requests), Viewer (read-only).",
      category: "team"
    }
  ];

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "dsar", name: "DSAR Processing" },
    { id: "ai", name: "AI Copilot" },
    { id: "billing", name: "Billing & Credits" },
    { id: "export", name: "Exports" },
    { id: "compliance", name: "GDPR Compliance" },
    { id: "team", name: "Team Management" }
  ];

  const filteredContent = helpContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContentSelect = (content: HelpContent) => {
    setSelectedContent(content);
  };

  const handleBack = () => {
    setSelectedContent(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            <h2 className="text-xl font-semibold">Help Center</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r p-6 overflow-y-auto">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-brand-100 text-brand-700"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Topics */}
            <div>
              <h3 className="font-medium mb-3">Topics</h3>
              <div className="space-y-2">
                {filteredContent.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => handleContentSelect(content)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{content.content}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedContent ? (
              <div>
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Topics
                </button>

                {/* Content */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">{selectedContent.title}</h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">{selectedContent.content}</p>
                  
                  {selectedContent.videoUrl && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Video Tutorial</h3>
                      <div className="bg-slate-100 rounded-lg p-4 flex items-center gap-3">
                        <Play className="w-5 h-5 text-brand-600" />
                        <span className="text-sm">Watch tutorial video</span>
                        <Button size="sm" variant="outline">
                          Play Video
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Related Topics */}
                  <div>
                    <h3 className="font-medium mb-3">Related Topics</h3>
                    <div className="space-y-2">
                      {helpContent
                        .filter(content => content.category === selectedContent.category && content.id !== selectedContent.id)
                        .slice(0, 3)
                        .map((content) => (
                          <button
                            key={content.id}
                            onClick={() => handleContentSelect(content)}
                            className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors border"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{content.title}</span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to Help Center</h3>
                <p className="text-slate-600 mb-6">
                  Search for topics or browse categories to find the help you need.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Card className="p-4 text-center">
                    <Search className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Search Topics</h4>
                    <p className="text-xs text-slate-600">Find specific help content</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <BookOpen className="w-6 h-6 text-brand-600 mx-auto mb-2" />
                    <h4 className="font-medium text-sm">Browse Categories</h4>
                    <p className="text-xs text-slate-600">Explore by topic area</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
