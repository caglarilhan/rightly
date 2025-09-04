// components/ConnectorWaitlist.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Calendar, 
  Users, 
  TrendingUp, 
  Check,
  Clock,
  Zap,
  ExternalLink,
  Bell
} from "lucide-react";

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'coming_soon' | 'beta' | 'released';
  waitlistCount: number;
  estimatedRelease: string;
  category: string;
}

export default function ConnectorWaitlist() {
  const [email, setEmail] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);

  const sampleConnectors: Connector[] = [
    {
      id: "gmail",
      name: "Gmail",
      description: "Connect your Gmail account to automatically process DSAR requests from email communications",
      icon: "📧",
      status: "coming_soon",
      waitlistCount: 1247,
      estimatedRelease: "Q2 2024",
      category: "Communication"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Integrate with Slack workspaces to discover and process data from team communications",
      icon: "💬",
      status: "coming_soon",
      waitlistCount: 892,
      estimatedRelease: "Q2 2024",
      category: "Communication"
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Scan Google Drive for personal data and automatically generate compliance reports",
      icon: "☁️",
      status: "beta",
      waitlistCount: 567,
      estimatedRelease: "Q1 2024",
      category: "Storage"
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Connect Dropbox accounts to discover and process personal data across files and folders",
      icon: "📁",
      status: "coming_soon",
      waitlistCount: 423,
      estimatedRelease: "Q3 2024",
      category: "Storage"
    },
    {
      id: "microsoft-teams",
      name: "Microsoft Teams",
      description: "Integrate with Teams to process DSAR requests from team communications and files",
      icon: "👥",
      status: "coming_soon",
      waitlistCount: 678,
      estimatedRelease: "Q3 2024",
      category: "Communication"
    },
    {
      id: "notion",
      name: "Notion",
      description: "Connect Notion workspaces to discover and process personal data from databases and pages",
      icon: "📝",
      status: "coming_soon",
      waitlistCount: 345,
      estimatedRelease: "Q4 2024",
      category: "Productivity"
    }
  ];

  useEffect(() => {
    setConnectors(sampleConnectors);
  }, []);

  const handleJoinWaitlist = async () => {
    if (!email || !selectedConnector) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update waitlist count
      setConnectors(prev => prev.map(connector => 
        connector.id === selectedConnector 
          ? { ...connector, waitlistCount: connector.waitlistCount + 1 }
          : connector
      ));
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setSelectedConnector(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to join waitlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'beta':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'coming_soon':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'released':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'beta':
        return 'Beta Access';
      case 'coming_soon':
        return 'Coming Soon';
      case 'released':
        return 'Released';
      default:
        return 'Unknown';
    }
  };

  const groupedConnectors = connectors.reduce((acc, connector) => {
    if (!acc[connector.category]) {
      acc[connector.category] = [];
    }
    acc[connector.category].push(connector);
    return acc;
  }, {} as Record<string, Connector[]>);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Connector Waitlist</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Be the first to know when new integrations are available
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🚀 Early access to new integrations</span>
          <span>•</span>
          <span>📧 Priority notifications</span>
          <span>•</span>
          <span>🎁 Exclusive beta access</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {connectors.reduce((sum, c) => sum + c.waitlistCount, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Waitlist</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">6</div>
                <div className="text-sm text-slate-600">Upcoming Connectors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">Q2 2024</div>
                <div className="text-sm text-slate-600">Next Release</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Join Waitlist Form */}
      {!submitted && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Join the Waitlist
            </CardTitle>
            <CardDescription>
              Get notified when new connectors are available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Select Connector
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {connectors.map((connector) => (
                    <button
                      key={connector.id}
                      onClick={() => setSelectedConnector(connector.id)}
                      className={`
                        p-3 border rounded-lg text-left transition-all
                        ${selectedConnector === connector.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{connector.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{connector.name}</div>
                          <div className="text-sm text-slate-500">{connector.description}</div>
                        </div>
                        <Badge className={getStatusColor(connector.status)}>
                          {getStatusText(connector.status)}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleJoinWaitlist}
                disabled={!email || !selectedConnector || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Joining Waitlist...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {submitted && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">You're on the waitlist!</h3>
                <p className="text-sm text-green-700">
                  We'll notify you when the connector is available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connectors by Category */}
      <div className="space-y-8">
        {Object.entries(groupedConnectors).map(([category, categoryConnectors]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryConnectors.map((connector) => (
                <Card key={connector.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{connector.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{connector.name}</CardTitle>
                          <Badge className={getStatusColor(connector.status)}>
                            {getStatusText(connector.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">
                      {connector.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>
                        <Users className="h-3 w-3 inline mr-1" />
                        {connector.waitlistCount} waiting
                      </span>
                      <span>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {connector.estimatedRelease}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Have a specific integration request?</h3>
            <p className="text-slate-600 mb-4">
              Let us know what connectors you need for your workflow
            </p>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Request Integration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
